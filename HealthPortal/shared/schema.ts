import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  age: integer("age").notNull(),
  height: integer("height").notNull(), // in cm
  weight: integer("weight").notNull(), // in kg
  bloodType: text("blood_type"),
  symptoms: text("symptoms").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  dosage: text("dosage").notNull(),
  price: decimal("price").notNull(),
  requiresPrescription: boolean("requires_prescription").notNull().default(true),
  inStock: boolean("in_stock").notNull().default(true),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  medicineId: integer("medicine_id").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: decimal("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
}).extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertConsultationSchema = createInsertSchema(consultations)
  .pick({
    age: true,
    height: true,
    weight: true,
    bloodType: true,
    symptoms: true,
  })
  .extend({
    age: z.number().min(18).max(120),
    height: z.number().min(100).max(250),
    weight: z.number().min(30).max(300),
    bloodType: z.string().optional(),
    symptoms: z.string().min(10).max(1000),
  });

export const insertMedicineSchema = createInsertSchema(medicines).pick({
  name: true,
  description: true,
  dosage: true,
  price: true,
  requiresPrescription: true,
  inStock: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  medicineId: true,
  quantity: true,
}).extend({
  quantity: z.number().min(1).max(10),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = typeof medicines.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;