import { AppError } from "../../../../shared/error/appError";
import { DigitalProductStrategy } from "./DigitalProductStrategy";
import { OrderTotalStrategy } from "./OrderTotalStrategy";
import { PhysicalProductStrategy } from "./PhysicalProductStrategy";

export class OrderTotalStrategyFactory {
  private static strategies: Record<string, OrderTotalStrategy> = {
    physical: new PhysicalProductStrategy(),
    digital: new DigitalProductStrategy(),
  };

  static getStrategy(type: string): OrderTotalStrategy {
    const strategy = this.strategies[type];
    if (!strategy) throw new AppError("Tipo de produto não suportado", 400);
    return strategy;
  }
}
