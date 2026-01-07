import express from "express";
import { OrderController } from "./modules/Order/controllers/OrderController";
import { PrismaClient } from "@prisma/client";
import { OrderService } from "./modules/Order/service/OrderService";
import { OrderRepository } from "./modules/Order/repository/OrderRepository";
import { EmailService } from "./modules/email/emailService";

const app = express();
app.use(express.json());
const prisma = new PrismaClient();
const orderRepository = new OrderRepository(prisma);
const emailService = new EmailService();
const orderService = new OrderService(orderRepository, emailService);
const orderController = new OrderController(orderService);

app.post("/orders", orderController.processOrder.bind(orderController));

export default app;
