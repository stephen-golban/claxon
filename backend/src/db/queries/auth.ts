import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { Database } from "../instance";
import { insertProfileSchema, insertUserSchema, profiles, user } from "../schemas";

/**
 * Find user by phone number
 */
export const findUserByPhone = async (db: Database, phoneNumber: string) => {
  return await db.select().from(user).where(eq(user.phoneNumber, phoneNumber)).limit(1);
};

/**
 * Update user phone verification status
 */
export const updateUserPhoneVerification = async (db: Database, phoneNumber: string) => {
  return await db
    .update(user)
    .set({
      phoneNumberVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(user.phoneNumber, phoneNumber))
    .returning();
};

/**
 * Find user profile by user ID
 */
export const findProfileByUserId = async (db: Database, userId: string) => {
  return await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
};

/**
 * Create new user account
 */
export const createUser = async (db: Database, userData: z.infer<typeof insertUserSchema>) => {
  const validatedData = insertUserSchema.parse(userData);
  return await db.insert(user).values(validatedData).returning();
};

/**
 * Create user profile
 */
export const createUserProfile = async (db: Database, profileData: z.infer<typeof insertProfileSchema>) => {
  const validatedData = insertProfileSchema.parse(profileData);
  return await db.insert(profiles).values(validatedData).returning();
};
