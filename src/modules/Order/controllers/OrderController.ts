import { Request, Response } from "express";
import { OrderService } from "../service/OrderService";
import { OrderValidator } from "../validator/OrderValidator";
import logger from "../../../shared/lib/logger";

export class OrderController {
  private readonly service: OrderService;

  constructor(service: OrderService) {
    this.service = service;
  }

  async processOrder(req: Request, res: Response): Promise<Response> {
    try {
      OrderValidator.validate(req.body);
      const result = await this.service.processOrder(req.body);
      return res.json(result);
    } catch (e: any) {
      logger.error(`Erro ao processar pedido: ${e.message}`);
      return res
        .status(e.status || 500)
        .json({ error: e.message || "Erro interno" });
    }
  }
}
