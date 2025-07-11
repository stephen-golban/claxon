import { eq } from "drizzle-orm";
import type { Database } from "../instance";
import { profiles, user } from "../schema";

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
export const createUser = async (
  db: Database,
  userData: {
    id: string;
    phoneNumber: string;
    name: string;
    email: string;
  },
) => {
  return await db
    .insert(user)
    .values({
      id: userData.id,
      phoneNumber: userData.phoneNumber,
      phoneNumberVerified: true,
      name: userData.name,
      email: userData.email,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
};

/**
 * Create user profile
 */
export const createUserProfile = async (
  db: Database,
  profileData: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: Date;
    gender: string;
    avatarUrl?: string;
    language?: string;
    isPhonePublic?: boolean;
  },
) => {
  return await db
    .insert(profiles)
    .values({
      id: profileData.id,
      userId: profileData.userId,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      dob: profileData.dob,
      gender: profileData.gender,
      avatarUrl: profileData.avatarUrl,
      language: profileData.language ?? "en",
      isPhonePublic: profileData.isPhonePublic ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
};
