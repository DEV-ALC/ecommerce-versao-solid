import { AppError } from "../../../shared/Error/AppError";

export class OrderValidator {
  static validate(order: InputProcessOrder) {
    if (!order.customer) {
      throw new AppError("Cliente é obrigatório", 400);
    }

    if (!order.items || order.items.length === 0) {
      throw new AppError("Carrinho vazio", 400);
    }

    order.items.forEach((item) => {
      if (!item.productId || item.quantity <= 0) {
        throw new AppError("Item inválido no pedido", 400);
      }
    });

    if (!["credit_card", "debit_card"].includes(order.paymentMethod)) {
      throw new AppError("Método de pagamento não suportado", 400);
    }
  }
}
