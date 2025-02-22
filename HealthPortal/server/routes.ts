import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertConsultationSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const consultationData = insertConsultationSchema.parse(req.body);
    const consultation = await storage.createConsultation({
      ...consultationData,
      userId: req.user!.id,
    });
    res.status(201).json(consultation);
  });

  app.get("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const consultations = await storage.getConsultations(req.user!.id);
    res.json(consultations);
  });

  app.get("/api/medicines", async (req, res) => {
    const medicines = await storage.getMedicines();
    res.json(medicines);
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const orderData = insertOrderSchema.parse(req.body);
    const medicine = await storage.getMedicine(orderData.medicineId);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (!medicine.inStock) {
      return res.status(400).json({ message: "Medicine is out of stock" });
    }

    if (medicine.requiresPrescription) {
      return res.status(400).json({ message: "Prescription required" });
    }

    const totalPrice = Number(medicine.price) * orderData.quantity;
    const order = await storage.createOrder({
      ...orderData,
      userId: req.user!.id,
      totalPrice,
    });

    res.status(201).json(order);
  });

  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getOrders(req.user!.id);
    res.json(orders);
  });

  const httpServer = createServer(app);
  return httpServer;
}