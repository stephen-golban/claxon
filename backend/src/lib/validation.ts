import { z } from "zod";

// Phone number validation for OTP endpoints
export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format (E.164)"),
});

// OTP verification validation
export const verifyOTPSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format (E.164)"),
  code: z
    .string()
    .min(6, "OTP code must be 6 digits")
    .max(6, "OTP code must be 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only digits"),
});

// Name validation - letters, spaces, hyphens, accented characters
const nameSchema = z
  .string()
  .min(1, "Name is required")
  .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, "Name can only contain letters, spaces, and hyphens");

// Email validation
const emailSchema = z.string().email("Invalid email format");

// Date of birth validation (minimum age 16)
const dobSchema = z
  .string()
  .datetime()
  .refine((dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      return age - 1 >= 16;
    }

    return age >= 16;
  }, "Must be at least 16 years old");

// Gender validation
const genderSchema = z.string().min(1, "Gender is required");

// Complete signup validation schema
export const completeSignupSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format (E.164)"),
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  dob: dobSchema,
  gender: genderSchema,
  avatarUrl: z.string().url().optional(),
  language: z.string().optional().default("en"),
  isPhonePublic: z.boolean().optional().default(false),
});
