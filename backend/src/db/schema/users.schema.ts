import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { claxons } from "./claxons.schema";
import { timestamps } from "./util.schema";
import { vehicles } from "./vehicles.schema";

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

    ...timestamps,
  },
  (table) => [
    index("phone_idx").on(table.phone),
    index("email_idx").on(table.email),
    index("clerk_id_idx").on(table.clerkId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  sentClaxons: many(claxons, { relationName: "sender" }),
  receivedClaxons: many(claxons, { relationName: "recipient" }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = insertUserSchema.partial().omit({
  id: true,
  clerkId: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

export const queryUserSchema = createSelectSchema(users)
  .pick({
    language: true,
    gender: true,
    isPhonePublic: true,
  })
  .partial();

export type QueryUser = z.infer<typeof queryUserSchema>;
