import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { claxons } from "./claxons.schema";
import { timestamps } from "./util.schema";
import { users } from "./users.schema";

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

    ...timestamps,
  },
  (table) => [
    index("vehicle_user_id_idx").on(table.userId),
    index("vehicle_vin_code_idx").on(table.vinCode),
    index("vehicle_is_active_idx").on(table.isActive),
    index("vehicle_plate_number_idx").on(table.plateNumber),
  ],
);

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
  claxons: many(claxons),
}));

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;

export const insertVehicleSchema = createInsertSchema(vehicles);
export const selectVehicleSchema = createSelectSchema(vehicles);
export const updateVehicleSchema = insertVehicleSchema.partial().omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateVehicle = z.infer<typeof updateVehicleSchema>;

export const queryVehicleSchema = createSelectSchema(vehicles)
  .pick({
    brand: true,
    model: true,
    color: true,
    plateType: true,
    plateCountry: true,
    isActive: true,
  })
  .partial();

export type QueryVehicle = z.infer<typeof queryVehicleSchema>;
