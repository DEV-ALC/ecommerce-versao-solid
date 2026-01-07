import { AppError } from "../../../../shared/Error/AppError";
import logger from "../../../../shared/lib/logger";
import { PagamentoStrategy } from "./PagamentoStrategy";

export class creditCardStrategy implements PagamentoStrategy {
  process(paymentDetails: any): void {
    logger.info(
      `Processando cartão final ${paymentDetails.cardNumber.slice(-4)}`
    );
    if (paymentDetails.cvv === "000")
      throw new AppError("Cartão recusado", 400);
  }
}
