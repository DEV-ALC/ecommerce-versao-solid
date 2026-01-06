import { Request } from "express";
import { OrderService } from "../service/OrderService";

export class OrderController {
  private readonly service: OrderService;

  constructor(service: OrderService) {
    this.service = service;
  }

  async processOrder(req: Request) {
    try {
      const body = req.body;
      return this.service.processOrder(body);
    } catch (e) {
      console.log(e);
    }
  }
}
