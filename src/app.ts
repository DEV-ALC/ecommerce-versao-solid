import express from "express";
import { OrderController } from "./modules/Order/controllers/OrderController";
import { PrismaClient } from "@prisma/client";
import { OrderService } from "./modules/Order/service/OrderService";
import { OrderRepository } from "./modules/Order/repository/OrderRepository";

const app = express();
app.use(express.json());
const prisma = new PrismaClient();
const repository = new OrderRepository(prisma);
const service = new OrderService(repository);
const orderController = new OrderController(service);

// Rota única que faz tudo
app.post("/orders", orderController.processOrder.bind(orderController));

export default app;
