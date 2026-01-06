import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import logger from "../lib/logger";
import { AppError } from "../shared/Error/AppError";
import { OrderRepository } from "../repository/OrderRepository";

interface IprocessOrder {
  customer: string;
  items: any;
  paymentMethod: any;
  paymentDetails: any;
}

interface OutputProcessOrder {
  message: string;
  orderId: string;
  emailPreview: string | false;
}

export class OrderService {
  private readonly repository: OrderRepository;

  constructor(repository: OrderRepository) {
    this.repository = repository;
  }

  // Método Gigante: Violação de SRP
  async processOrder(body: IprocessOrder): Promise<OutputProcessOrder> {
    try {
      // 1. VALIDAÇÃO (Deveria estar em outro lugar)
      if (!body.items || body.items.length === 0) {
        logger.error("Tentativa de pedido sem itens");
        throw new AppError("Carrinho vazio", 400);
      }

      // 2. CÁLCULO DE PREÇO E ESTOQUE (Regra de Negócio Misturada)
      let totalAmount = 0;
      let productsDetails = [];

      for (const item of body.items) {
        const product = await this.repository.findProductById(item.productId);

        if (!product) {
          throw new AppError(`Produto ${item.productId} não encontrado`, 400);
        }

        // Violação de LSP e OCP:
        // Lógica condicional baseada em "tipo" (String).
        // Se adicionarmos "Serviço" ou "Assinatura", teremos que mexer aqui.
        if (product.type === "physical") {
          totalAmount += product.price * item.quantity;
          // Frete fixo simples
          totalAmount += 10;
        } else if (product.type === "digital") {
          totalAmount += product.price * item.quantity;
          // Produtos digitais não deveriam ter frete, ok.
          // Mas se o aluno tentar tratar 'item' genericamente depois, vai ter problemas.
        }

        productsDetails.push({ ...product, quantity: item.quantity });
      }

      // 3. PROCESSAMENTO DE PAGAMENTO (Violação de OCP)
      // Se quisermos adicionar "Pix", temos que modificar essa classe.
      if (body.paymentMethod === "credit_card") {
        logger.info(
          `Processando cartão final ${body.paymentDetails.cardNumber.slice(-4)}`
        );
        // Simulação de gateway
        if (body.paymentDetails.cvv === "000")
          throw new Error("Cartão recusado");
      } else if (body.paymentMethod === "debit_card") {
        logger.info("Processando débito...");
        // Lógica de débito
      } else {
        throw new AppError("Método de pagamento não suportado", 400);
      }

      // 4. PERSISTÊNCIA (Violação de SRP - Controller acessando Banco)
      const order = await this.repository.createOrder({
        customer: body.customer,
        items: JSON.stringify(productsDetails),
        total: totalAmount,
        status: "confirmed",
      });

      // 5. NOTIFICAÇÃO (Violação de SRP - Efeitos colaterais no Controller)
      const mailer = await getMailClient();

      const info = await mailer.sendMail({
        from: '"DevStore" <noreply@devstore.com>',
        to: body.customer, // O email do cliente vindo do body
        subject: `Confirmação do Pedido #${order.id}`,
        text: `Olá, seu pedido #${order.id} no valor de R$ ${totalAmount} foi confirmado.`,
        html: `
          <h1>Pedido Confirmado!</h1>
          <p>Olá, seu pedido <b>#${order.id}</b> foi processado com sucesso.</p>
          <p>Total: <strong>R$ ${totalAmount}</strong></p>
          <ul>
            ${productsDetails.map((p) => `<li>${p.name}</li>`).join("")}
          </ul>
        `,
      });

      // use este link para visualizar no Ethereal
      logger.info(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`);

      return {
        message: "Pedido processado com sucesso",
        orderId: order.id,
        emailPreview: nodemailer.getTestMessageUrl(info),
      };
    } catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);
      throw new AppError("Erro interno", 500);
    }
  }
}
