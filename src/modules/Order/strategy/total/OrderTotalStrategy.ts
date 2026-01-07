export interface OrderTotalStrategy {
  calculateTotal(product: ProductDetail, quantity: number): number;
}
