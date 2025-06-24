import { relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Users table - matches Convex User schema
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // Will use Clerk user ID as primary key
    phone: text("phone").notNull().unique(),
    email: text("email").notNull().unique(),
    clerkId: text("clerk_id").notNull().unique(),

    // Optional fields
    dob: text("dob"),
    gender: text("gender"),
    language: text("language"),
    lastName: text("last_name"),
    firstName: text("first_name"),
    avatarUrl: text("avatar_url"),
    privacySettings: text("privacy_settings"), // JSON string
    isPhonePublic: boolean("is_phone_public").default(false),
    notificationPreferences: text("notification_preferences"), // JSON string

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("phone_idx").on(table.phone),
    index("email_idx").on(table.email),
    index("clerk_id_idx").on(table.clerkId),
  ],
);

// Vehicles table - matches Convex Vehicle schema
export const vehicles = pgTable(
  "vehicles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Vehicle details
    brand: text("brand"),
    model: text("model"),
    color: text("color"),
    phase: text("phase"),
    vinCode: text("vin_code"),
    plateType: text("plate_type"),
    plateNumber: text("plate_number"),
    plateCountry: text("plate_country"),
    plateLeftPart: text("plate_left_part"),
    plateRightPart: text("plate_right_part"),
    manufactureYear: integer("manufacture_year"),

    // Status
    isActive: boolean("is_active").default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("vehicle_user_id_idx").on(table.userId),
    index("vehicle_vin_code_idx").on(table.vinCode),
    index("vehicle_is_active_idx").on(table.isActive),
    index("vehicle_plate_number_idx").on(table.plateNumber),
  ],
);

// Claxon Templates table - matches Convex ClaxonTemplate schema
export const claxonTemplates = pgTable(
  "claxon_templates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    category: text("category").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    messageEn: text("message_en").notNull(),
    messageRo: text("message_ro").notNull(),
    messageRu: text("message_ru").notNull(),
    icon: text("icon"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("template_category_idx").on(table.category), index("template_is_active_idx").on(table.isActive)],
);

// Claxons table - matches Convex Claxon schema (messages/alerts)
export const claxons = pgTable(
  "claxons",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: text("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    vehicleId: text("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    templateId: text("template_id").references(() => claxonTemplates.id),

    licensePlate: text("license_plate").notNull(),
    type: text("type"),
    customMessage: text("custom_message"),
    senderLanguage: text("sender_language"),

    // Status
    read: boolean("read").default(false),
    readAt: timestamp("read_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("claxon_sender_id_idx").on(table.senderId),
    index("claxon_recipient_id_idx").on(table.recipientId),
    index("claxon_vehicle_id_idx").on(table.vehicleId),
    index("claxon_template_id_idx").on(table.templateId),
    index("claxon_read_idx").on(table.read),
    index("claxon_type_idx").on(table.type),
    index("claxon_read_at_idx").on(table.readAt),
    index("claxon_sender_language_idx").on(table.senderLanguage),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  sentClaxons: many(claxons, { relationName: "sender" }),
  receivedClaxons: many(claxons, { relationName: "recipient" }),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
  claxons: many(claxons),
}));

export const claxonTemplatesRelations = relations(claxonTemplates, ({ many }) => ({
  claxons: many(claxons),
}));

export const claxonsRelations = relations(claxons, ({ one }) => ({
  sender: one(users, {
    fields: [claxons.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  recipient: one(users, {
    fields: [claxons.recipientId],
    references: [users.id],
    relationName: "recipient",
  }),
  vehicle: one(vehicles, {
    fields: [claxons.vehicleId],
    references: [vehicles.id],
  }),
  template: one(claxonTemplates, {
    fields: [claxons.templateId],
    references: [claxonTemplates.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type ClaxonTemplate = typeof claxonTemplates.$inferSelect;
export type NewClaxonTemplate = typeof claxonTemplates.$inferInsert;
export type Claxon = typeof claxons.$inferSelect;
export type NewClaxon = typeof claxons.$inferInsert;

// Export Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = insertUserSchema.partial().omit({
  id: true,
  clerkId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles);
export const selectVehicleSchema = createSelectSchema(vehicles);
export const updateVehicleSchema = insertVehicleSchema.partial().omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClaxonTemplateSchema = createInsertSchema(claxonTemplates);
export const selectClaxonTemplateSchema = createSelectSchema(claxonTemplates);
export const updateClaxonTemplateSchema = insertClaxonTemplateSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClaxonSchema = createInsertSchema(claxons);
export const selectClaxonSchema = createSelectSchema(claxons);
export const updateClaxonSchema = insertClaxonSchema.partial().omit({
  id: true,
  senderId: true,
  createdAt: true,
  updatedAt: true,
});
