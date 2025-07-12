import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { user } from "./user";

export const profile = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  dob: timestamp("dob"),
  gender: text("gender"),
  avatarUrl: text("avatar_url"),
  isPhonePublic: boolean("is_phone_public").$defaultFn(() => false),
  language: text("language").$defaultFn(() => "en"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const insertProfileSchema = createInsertSchema(profile);
export const selectProfileSchema = createSelectSchema(profile);
export const updateProfileSchema = createUpdateSchema(profile);
