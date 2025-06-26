import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { claxonTemplates } from "./claxon-templates.schema";
import { timestamps } from "./util.schema";
import { users } from "./users.schema";
import { vehicles } from "./vehicles.schema";

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

    ...timestamps,
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

export type Claxon = typeof claxons.$inferSelect;
export type NewClaxon = typeof claxons.$inferInsert;

export const insertClaxonSchema = createInsertSchema(claxons);
export const selectClaxonSchema = createSelectSchema(claxons);
export const updateClaxonSchema = insertClaxonSchema.partial().omit({
  id: true,
  senderId: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateClaxon = z.infer<typeof updateClaxonSchema>;

export const queryClaxonSchema = createSelectSchema(claxons)
  .pick({
    read: true,
    type: true,
    senderLanguage: true,
  })
  .partial();

export type QueryClaxon = z.infer<typeof queryClaxonSchema>;
