import { getMailClient } from "../../shared/lib/mail";
import nodemailer from "nodemailer";
import logger from "../../shared/lib/logger";
import { AppError } from "../../shared/Error/AppError";

interface EmailData {
  customer: string;
  productsDetails: ProductDetail[];
  orderId: number;
  total: number;
}

export class EmailService {
  async sendEmailOrder(data: EmailData) {
    try {
      const mailer = await getMailClient();

      const info = await mailer.sendMail({
        from: '"DevStore" <noreply@devstore.com>',
        to: data.customer, // O email do cliente vindo do body
        subject: `Confirmação do Pedido #${data.orderId}`,
        text: `Olá, seu pedido #${data.orderId} no valor de R$ ${data.total} foi confirmado.`,
        html: `
          <h1>Pedido Confirmado!</h1>
          <p>Olá, seu pedido <b>#${
            data.orderId
          }</b> foi processado com sucesso.</p>
          <p>Total: <strong>R$ ${data.total}</strong></p>
          <ul>
            ${data.productsDetails.map((p) => `<li>${p.name}</li>`).join("")}
          </ul>
        `,
      });

      // use este link para visualizar no Ethereal
      logger.info(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`);

      return nodemailer.getTestMessageUrl(info);
    } catch (error: any) {
      throw new AppError("Erro interno", 500);
    }
  }
}
