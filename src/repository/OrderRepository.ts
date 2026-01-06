import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import logger from "../lib/logger";
import { AppError } from "../shared/Error/AppError";

export class OrderRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findProductById(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    return product;
  }

  async createOrder(data: OrderDto) {
    try {
      const order = await this.prisma.order.create({
        data: {
          customer: data.customer,
          items: data.items,
          total: data.total,
          status: data.status,
        },
      });
      return order;
    } catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);
      throw new AppError("Erro interno", 500);
    }
  }
}
