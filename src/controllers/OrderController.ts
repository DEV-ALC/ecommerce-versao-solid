import { Request, Response } from "express";
import { OrderService } from "../service/OrderService";

export class OrderController {
  private readonly service: OrderService;

  constructor(service: OrderService) {
    this.service = service;
  }

  async processOrder(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.service.processOrder(req.body);
      return res.json(result);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ error: e.message || "Erro interno" });
    }
  }
}
