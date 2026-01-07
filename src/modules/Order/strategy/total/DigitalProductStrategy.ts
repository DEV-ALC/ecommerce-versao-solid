import { OrderTotalStrategy } from "./OrderTotalStrategy";

export class DigitalProductStrategy implements OrderTotalStrategy {
  calculateTotal(product: ProductDetail, quantity: number): number {
    return product.price * quantity;
  }
}
