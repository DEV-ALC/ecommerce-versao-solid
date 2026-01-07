import { AppError } from "../../../shared/error/appError";
import { OrderRepository } from "../repository/OrderRepository";
import { EmailService } from "../../email/emailService";
import { OrderTotalStrategyFactory } from "../strategy/total/OrderTotalFactory";
import { PagamentoStrategyFactory } from "../strategy/pagamento/pagamentoFactory";

export class OrderService {
  private readonly repository: OrderRepository;
  private readonly emailService: EmailService;

  constructor(repository: OrderRepository, emailService: EmailService) {
    this.repository = repository;
    this.emailService = emailService;
  }

  async processOrder(body: InputProcessOrder): Promise<OutputProcessOrder> {
    try {
      let totalAmount = 0;
      let productsDetails: ProductDetail[] = [];

      for (const item of body.items) {
        const product = await this.repository.findProductById(item.productId);

        if (!product) {
          throw new AppError(`Produto ${item.productId} não encontrado`, 400);
        }

        const strategyTotal = OrderTotalStrategyFactory.getStrategy(
          product.type
        );
        totalAmount += strategyTotal.calculateTotal(product, item.quantity);

        productsDetails.push({
          id: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
          quantity: item.quantity,
        });
      }

      const strategyPagamento = PagamentoStrategyFactory.getStrategy(
        body.paymentMethod
      );
      strategyPagamento.process(body.paymentDetails);

      const order = await this.repository.createOrder({
        customer: body.customer,
        items: JSON.stringify(productsDetails),
        total: totalAmount,
        status: "confirmed",
      });

      const info = await this.emailService.sendEmailOrder({
        customer: body.customer,
        productsDetails: productsDetails,
        orderId: order.id,
        total: totalAmount,
      });

      return {
        message: "Pedido processado com sucesso",
        orderId: order.id,
        emailPreview: info,
      };
    } catch (error: any) {
      throw new AppError("Erro interno ao processar", 500);
    }
  }
}
