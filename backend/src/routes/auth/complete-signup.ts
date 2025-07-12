import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ERROR_CODES, SUCCESS_CODES } from "../../../error-codes";
import { createDb } from "../../db/instance";
import { createUser, createUserProfile, findUserByPhone } from "../../db/queries/auth";
import { completeSignupSchema } from "../../lib/validation";

const completeSignupRoute = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Complete signup for new users
 * Creates user and profile after personal details are provided
 */
completeSignupRoute.post("/", zValidator("json", completeSignupSchema), async (c) => {
  try {
    const validatedData = c.req.valid("json");
    const { phoneNumber, firstName, lastName, email, dob, gender, avatarUrl, language, isPhonePublic } = validatedData;

    const db = createDb(c.env);

    // Check if user already exists
    const existingUser = await findUserByPhone(db, phoneNumber);

    if (existingUser.length > 0) {
      return c.json({ error: ERROR_CODES.USER_ALREADY_EXISTS }, 400);
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
      message: SUCCESS_CODES.ACCOUNT_CREATED,
    });
  } catch (error) {
    console.error("Complete signup error:", error);
    return c.json({ error: ERROR_CODES.INTERNAL_SERVER_ERROR }, 500);
  }
});

export default completeSignupRoute;
