import { pgTable, serial, text, varchar, timestamp, integer, doublePrecision, boolean, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table (Handles Customers, Technicians, and Admins)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // standard text password for simplified full-stack auth
  role: varchar("role", { length: 50 }).notNull().default("customer"), // 'customer' | 'technician' | 'admin'
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  avatar: text("avatar"),
  rating: doublePrecision("rating").default(5.0), // For technicians
  specialty: varchar("specialty", { length: 255 }), // For technicians (e.g., 'Sewer Specialist', 'Water Heaters')
  isAvailable: boolean("is_available").default(true), // For technicians availability
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Appointments / Jobs Table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  technicianId: integer("technician_id").references(() => users.id, { onDelete: "set null" }),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  description: text("description").notNull(),
  urgency: varchar("urgency", { length: 50 }).notNull().default("standard"), // 'emergency' | 'high' | 'standard' | 'maintenance'
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending' | 'scheduled' | 'dispatched' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
  scheduledAt: timestamp("scheduled_at").notNull(),
  durationHours: integer("duration_hours").default(2),
  address: text("address").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("unpaid"), // 'unpaid' | 'paid'
  beforePhoto: text("before_photo"),
  afterPhoto: text("after_photo"),
  customerSignature: text("customer_signature"),
  notes: text("notes"),
  technicianNotes: text("technician_notes"),
  laborHours: doublePrecision("labor_hours").default(0.0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Estimates Table (with AI assessment details)
export const estimates = pgTable("estimates", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
  estimatedCostLow: decimal("estimated_cost_low", { precision: 10, scale: 2 }).notNull(),
  estimatedCostHigh: decimal("estimated_cost_high", { precision: 10, scale: 2 }).notNull(),
  photoUrl: text("photo_url"),
  aiExplanation: text("ai_explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Invoices Table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id, { onDelete: "cascade" }),
  customerId: integer("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("unpaid"), // 'unpaid' | 'paid' | 'overdue'
  dueAt: timestamp("due_at").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Inventory Table
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // 'pipes' | 'fittings' | 'valves' | 'water_heaters' | 'fixtures' | 'tools'
  count: integer("count").notNull().default(0),
  minRequired: integer("min_required").notNull().default(10),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  supplier: varchar("supplier", { length: 255 }),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  technicianId: integer("technician_id").references(() => users.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Posts / Guides Table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // 'DIY' | 'Maintenance' | 'Seasonal' | 'Buying Guides'
  author: varchar("author", { length: 100 }).notNull().default("Expert Plumber"),
  readTime: varchar("read_time", { length: 50 }).default("5 min read"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

// Referrals Table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  refereeName: varchar("referee_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending' | 'completed'
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }).default("50.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat Messages (For communication / real-time updates log)
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id, { onDelete: "cascade" }),
  senderId: integer("sender_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  receiverId: integer("receiver_id").references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  appointmentsAsCustomer: many(appointments, { relationName: "customerAppointments" }),
  appointmentsAsTechnician: many(appointments, { relationName: "technicianAppointments" }),
  estimates: many(estimates),
  invoices: many(invoices),
  reviews: many(reviews),
  referrals: many(referrals),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  customer: one(users, {
    fields: [appointments.customerId],
    references: [users.id],
    relationName: "customerAppointments",
  }),
  technician: one(users, {
    fields: [appointments.technicianId],
    references: [users.id],
    relationName: "technicianAppointments",
  }),
  invoices: many(invoices),
  messages: many(messages),
}));

export const estimatesRelations = relations(estimates, ({ one }) => ({
  customer: one(users, {
    fields: [estimates.customerId],
    references: [users.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  appointment: one(appointments, {
    fields: [invoices.appointmentId],
    references: [appointments.id],
  }),
  customer: one(users, {
    fields: [invoices.customerId],
    references: [users.id],
  }),
}));
