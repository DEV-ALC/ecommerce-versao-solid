import { PrismaClient } from "@prisma/client";

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
    const order = await this.prisma.order.create({
      data: {
        customer: data.customer,
        items: data.items,
        total: data.total,
        status: data.status,
      },
    });
    return order;
  }
}
