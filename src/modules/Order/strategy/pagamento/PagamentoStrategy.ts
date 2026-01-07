export interface PagamentoStrategy {
  process(paymentDetails: any): void;
}
