import { AppError } from "../../../../shared/Error/AppError";
import { creditCardStrategy } from "./creditCardStrategy";
import { debitCardStrategy } from "./debitCardStrategy";
import { PagamentoStrategy } from "./PagamentoStrategy";

export class PagamentoStrategyFactory {
  private static strategies: Record<string, PagamentoStrategy> = {
    credit_card: new creditCardStrategy(),
    debit_card: new debitCardStrategy(),
  };

  static getStrategy(type: string): PagamentoStrategy {
    const strategy = this.strategies[type];
    if (!strategy) throw new AppError("Método de pagamento não suportado", 400);
    return strategy;
  }
}
