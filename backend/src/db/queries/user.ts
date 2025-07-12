import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { Database } from "../instance";
import { insertUserSchema, updateUserSchema, user } from "../schemas";

export const updateUser = async (db: Database, dto: z.infer<typeof updateUserSchema>) => {
  const validatedData = updateUserSchema.parse(dto);

  if (!validatedData.id) {
    throw new Error("User ID is required for update");
  }

  // Omit 'id' from the set object to avoid trying to update the primary key
  const { id, ...updateFields } = validatedData;
  return await db.update(user).set(updateFields).where(eq(user.id, id)).returning();
};

export const findUserByPhone = async (db: Database, phoneNumber: string) => {
  return await db.select().from(user).where(eq(user.phoneNumber, phoneNumber)).limit(1);
};

export const findUserByEmail = async (db: Database, email: string) => {
  return await db.select().from(user).where(eq(user.email, email)).limit(1);
};

export const findUserById = async (db: Database, id: string) => {
  return await db.select().from(user).where(eq(user.id, id)).limit(1);
};

export const createUser = async (db: Database, dto: z.infer<typeof insertUserSchema>) => {
  const validatedData = insertUserSchema.parse(dto);
  return await db.insert(user).values(validatedData).returning();
};
