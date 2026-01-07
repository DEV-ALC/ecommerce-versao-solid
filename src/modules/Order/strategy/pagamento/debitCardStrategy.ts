import logger from "../../../../shared/lib/logger";
import { PagamentoStrategy } from "./PagamentoStrategy";

export class debitCardStrategy implements PagamentoStrategy {
  process(paymentDetails: any): void {
    logger.info("Processando débito...");
  }
}
