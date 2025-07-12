import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { Database } from "../instance";
import { insertProfileSchema, profile, updateProfileSchema } from "../schemas";

export const updateProfile = async (db: Database, dto: z.infer<typeof updateProfileSchema>) => {
  const validatedData = updateProfileSchema.parse(dto);

  if (!validatedData.id) {
    throw new Error("Profile ID is required for update");
  }

  // Omit 'id' from the set object to avoid trying to update the primary key
  const { id, ...updateFields } = validatedData;
  return await db.update(profile).set(updateFields).where(eq(profile.id, id)).returning();
};

export const findProfileByUserId = async (db: Database, userId: string) => {
  return await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);
};

export const createProfile = async (db: Database, dto: z.infer<typeof insertProfileSchema>) => {
  const validatedData = insertProfileSchema.parse(dto);
  return await db.insert(profile).values(validatedData).returning();
};
