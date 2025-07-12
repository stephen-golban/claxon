import { z } from "zod";
import { insertProfileSchema, insertUserSchema } from "../db/schemas";

// Phone number validation for OTP endpoints
export const phoneNumberSchema = z.object({
	phone: z
		.string()
		.min(1, "Phone number is required")
		.regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format (E.164)"),
});

// OTP verification validation
export const verifyOTPSchema = z.object({
	phone: z
		.string()
		.min(1, "Phone number is required")
		.regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format (E.164)"),
	code: z
		.string()
		.min(6, "OTP code must be 6 digits")
		.max(6, "OTP code must be 6 digits")
		.regex(/^\d{6}$/, "OTP code must contain only digits"),
});

// Complete signup validation schema - based on profile insert schema
export const completeSignupSchema = insertProfileSchema
	.omit({
		id: true,
		userId: true,
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		phoneNumber: z
			.string()
			.min(1, "Phone number is required")
			.regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format (E.164)"),
	});

// User creation schema - based on user insert schema
export const createUserSchema = insertUserSchema
	.omit({
		phoneNumberVerified: true,
		emailVerified: true,
		image: true,
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		id: z.string().uuid(),
		phoneNumber: z
			.string()
			.min(1, "Phone number is required")
			.regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format (E.164)"),
	});

// Profile creation schema - based on profile insert schema
export const createProfileSchema = insertProfileSchema
	.omit({
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		id: z.string().uuid(),
		userId: z.string().uuid(),
	});
