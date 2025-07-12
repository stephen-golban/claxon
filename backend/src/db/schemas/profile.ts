import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { user } from "./user";

export const profile = pgTable("profiles", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
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

export const insertProfileSchema = createInsertSchema(profile);
export const selectProfileSchema = createSelectSchema(profile);
export const updateProfileSchema = createUpdateSchema(profile);
