import { OrderTotalStrategy } from "./OrderTotalStrategy";

export class PhysicalProductStrategy implements OrderTotalStrategy {
  calculateTotal(product: ProductDetail, quantity: number): number {
    return product.price * quantity + 10;
  }
}
