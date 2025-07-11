import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createDb } from "../db/instance";
import {
  createUser,
  createUserProfile,
  findProfileByUserId,
  findUserByPhone,
  updateUserPhoneVerification,
} from "../db/queries/auth";
import { sendOTP, verifyOTP } from "../lib/twilio";
import { completeSignupSchema, phoneNumberSchema, verifyOTPSchema } from "../lib/validation";

const authRoutes = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Send OTP to phone number
 * Handles both existing users (sign-in) and new users (sign-up)
 */
authRoutes.post("/send-otp", zValidator("json", phoneNumberSchema), async (c) => {
  try {
    const { phoneNumber } = c.req.valid("json");

    // Send OTP via Twilio
    const success = await sendOTP(c.env, phoneNumber);

    if (!success) {
      return c.json({ error: "Failed to send OTP" }, 500);
    }

    return c.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * Verify OTP and determine user status
 * Returns whether user exists or needs to complete signup
 */
authRoutes.post("/verify-otp", zValidator("json", verifyOTPSchema), async (c) => {
  try {
    const { phoneNumber, code } = c.req.valid("json");

    // Verify OTP with Twilio
    const isValidOTP = await verifyOTP(c.env, phoneNumber, code);

    if (!isValidOTP) {
      return c.json({ error: "Invalid or expired OTP" }, 400);
    }

    // Check if user exists
    const db = createDb(c.env);
    const existingUser = await findUserByPhone(db, phoneNumber);

    if (existingUser.length > 0) {
      // Existing user - update phone verification status
      await updateUserPhoneVerification(db, phoneNumber);

      // Check if user has completed profile
      const userProfile = await findProfileByUserId(db, existingUser[0].id);

      return c.json({
        success: true,
        userExists: true,
        userId: existingUser[0].id,
        hasProfile: userProfile.length > 0,
        message: "User authenticated successfully",
      });
    } else {
      // New user - return verification token for completing signup
      return c.json({
        success: true,
        userExists: false,
        phoneNumber: phoneNumber,
        message: "Phone number verified. Please complete your profile.",
      });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

/**
 * Complete signup for new users
 * Creates user and profile after personal details are provided
 */
authRoutes.post("/complete-signup", zValidator("json", completeSignupSchema), async (c) => {
  try {
    const validatedData = c.req.valid("json");
    const { phoneNumber, firstName, lastName, email, dob, gender, avatarUrl, language, isPhonePublic } = validatedData;

    const db = createDb(c.env);

    // Check if user already exists
    const existingUser = await findUserByPhone(db, phoneNumber);

    if (existingUser.length > 0) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Create new user in Better Auth user table
    const userId = crypto.randomUUID();
    const [newUser] = await createUser(db, {
      id: userId,
      phoneNumber: phoneNumber,
      name: `${firstName} ${lastName}`,
      email: email,
    });

    // Create user profile with detailed information
    const [newProfile] = await createUserProfile(db, {
      id: crypto.randomUUID(),
      userId: newUser.id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      dob: new Date(dob),
      gender: gender,
      avatarUrl: avatarUrl,
      language: language,
      isPhonePublic: isPhonePublic,
    });

    return c.json({
      success: true,
      userId: newUser.id,
      profileId: newProfile.id,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Complete signup error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default authRoutes;
