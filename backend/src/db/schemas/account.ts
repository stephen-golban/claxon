import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const account = pgTable("accounts", {
  id: text("id").primaryKey(),
  clerk_id: text("clerk_id").notNull(),
  phone: text("phone_number").notNull().unique(),
  email: text("email"),
  dob: timestamp("dob"),
  gender: text("gender"),
  last_name: text("last_name"),
  avatar_url: text("avatar_url"),
  first_name: text("first_name"),
  language: text("language").$defaultFn(() => "ro"),
  is_phone_public: boolean("is_phone_public").$defaultFn(() => false),
  created_at: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updated_at: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const insertAccountSchema = createInsertSchema(account);
export const selectAccountSchema = createSelectSchema(account);
export const updateAccountSchema = createUpdateSchema(account);
