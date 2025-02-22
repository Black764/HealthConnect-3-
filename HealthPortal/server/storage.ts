import { users, consultations, medicines, orders, passwordResetTokens, type User, type InsertUser, type Consultation, type InsertConsultation, type Medicine, type InsertMedicine, type Order, type InsertOrder } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

interface PasswordResetToken {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;

  createPasswordResetToken(data: { userId: number; token: string; expiresAt: Date }): Promise<void>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  deletePasswordResetToken(token: string): Promise<void>;

  createConsultation(consultation: InsertConsultation & { userId: number }): Promise<Consultation>;
  getConsultations(userId: number): Promise<Consultation[]>;

  getMedicines(): Promise<Medicine[]>;
  getMedicine(id: number): Promise<Medicine | undefined>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;

  createOrder(order: InsertOrder & { userId: number; totalPrice: number }): Promise<Order>;
  getOrders(userId: number): Promise<Order[]>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private consultations: Map<number, Consultation>;
  private medicines: Map<number, Medicine>;
  private orders: Map<number, Order>;
  private passwordResetTokens: Map<string, PasswordResetToken>;
  currentId: number;
  consultationId: number;
  medicineId: number;
  orderId: number;
  tokenId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.consultations = new Map();
    this.medicines = new Map();
    this.orders = new Map();
    this.passwordResetTokens = new Map();
    this.currentId = 1;
    this.consultationId = 1;
    this.medicineId = 1;
    this.orderId = 1;
    this.tokenId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24h
    });

    // Add sample medicines
    // HIV Medications
    this.createMedicine({
      name: "Atripla",
      description: "Complete HIV treatment regimen containing efavirenz, emtricitabine, and tenofovir",
      dosage: "600mg/200mg/300mg",
      price: "89.99",
      requiresPrescription: true,
      inStock: true,
    });

    this.createMedicine({
      name: "Biktarvy",
      description: "Single tablet HIV treatment containing bictegravir, emtricitabine, and tenofovir",
      dosage: "50mg/200mg/25mg",
      price: "99.99",
      requiresPrescription: true,
      inStock: true,
    });

    // Contraceptives
    this.createMedicine({
      name: "Premium Condoms (Pack of 12)",
      description: "Latex condoms with lubricant for safe sex practices",
      dosage: "One-size",
      price: "12.99",
      requiresPrescription: false,
      inStock: true,
    });

    this.createMedicine({
      name: "Birth Control Pills",
      description: "Monthly oral contraceptive pills",
      dosage: "28-day pack",
      price: "24.99",
      requiresPrescription: true,
      inStock: true,
    });

    // Emergency Contraception
    this.createMedicine({
      name: "Plan B One-Step",
      description: "Emergency contraception to prevent pregnancy when taken within 72 hours",
      dosage: "1.5mg",
      price: "49.99",
      requiresPrescription: false,
      inStock: true,
    });

    // Common Medications
    this.createMedicine({
      name: "Generic Paracetamol",
      description: "Pain relief and fever reduction",
      dosage: "500mg",
      price: "9.99",
      requiresPrescription: false,
      inStock: true,
    });

    this.createMedicine({
      name: "Allergy Relief",
      description: "24-hour allergy relief antihistamine",
      dosage: "10mg",
      price: "19.99",
      requiresPrescription: false,
      inStock: true,
    });

    this.createMedicine({
      name: "Antibiotics",
      description: "Broad-spectrum antibiotic (requires prescription)",
      dosage: "250mg",
      price: "29.99",
      requiresPrescription: true,
      inStock: true,
    });

    this.createMedicine({
      name: "PrEP (Pre-Exposure Prophylaxis)",
      description: "Daily medication to prevent HIV infection in high-risk individuals",
      dosage: "200mg/300mg",
      price: "79.99",
      requiresPrescription: true,
      inStock: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.password = newPassword;
      this.users.set(userId, user);
    }
  }

  async createPasswordResetToken(data: { userId: number; token: string; expiresAt: Date }): Promise<void> {
    const token: PasswordResetToken = {
      id: this.tokenId++,
      ...data,
      createdAt: new Date(),
    };
    this.passwordResetTokens.set(data.token, token);
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    return this.passwordResetTokens.get(token);
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    this.passwordResetTokens.delete(token);
  }

  async createConsultation(data: InsertConsultation & { userId: number }): Promise<Consultation> {
    const id = this.consultationId++;
    const consultation: Consultation = {
      ...data,
      id,
      status: "pending",
      createdAt: new Date(),
      bloodType: data.bloodType || null,
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getConsultations(userId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.userId === userId
    );
  }

  async getMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async getMedicine(id: number): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const id = this.medicineId++;
    const medicine: Medicine = {
      id,
      name: insertMedicine.name,
      description: insertMedicine.description,
      dosage: insertMedicine.dosage,
      price: insertMedicine.price,
      requiresPrescription: insertMedicine.requiresPrescription ?? false,
      inStock: insertMedicine.inStock ?? true,
    };
    this.medicines.set(id, medicine);
    return medicine;
  }

  async createOrder(data: InsertOrder & { userId: number; totalPrice: number }): Promise<Order> {
    const id = this.orderId++;
    const order: Order = {
      ...data,
      id,
      status: "pending",
      createdAt: new Date(),
      totalPrice: data.totalPrice.toString(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
}

export const storage = new MemStorage();