import { z } from "zod";

// Phone number validation for OTP endpoints
export const phoneNumberSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
});

// OTP verification validation
export const verifyOTPSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  code: z
    .string()
    .length(6, "OTP code must be 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only digits"),
});
