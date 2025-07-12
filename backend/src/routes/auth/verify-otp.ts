import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ERROR_CODES, SUCCESS_CODES } from "../../../error-codes";
import { createDb } from "../../db/instance";
import {
	findProfileByUserId,
	findUserByPhone,
	updateUser,
} from "../../db/queries";
import { verifyOTP } from "../../lib/twilio";
import { verifyOTPSchema } from "../../lib/validation";

const verifyOtpRoute = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Verify OTP and determine user status
 * Returns whether user exists or needs to complete signup
 */
verifyOtpRoute.post("/", zValidator("json", verifyOTPSchema), async (c) => {
	try {
		const { phone, code } = c.req.valid("json");

		// Verify OTP with Twilio
		const isValidOTP = await verifyOTP(c.env, phone, code);

		if (!isValidOTP) {
			return c.json({ error: ERROR_CODES.OTP_INVALID_OR_EXPIRED }, 400);
		}

		// Check if user exists
		const db = createDb(c.env);
		const existingUser = await findUserByPhone(db, phone);

		if (existingUser.length > 0) {
			// Existing user - update phone verification status
			await updateUser(db, {
				updatedAt: new Date(),
				id: existingUser[0].id,
				phoneNumberVerified: true,
			});

			// Check if user has completed profile
			const profile = await findProfileByUserId(db, existingUser[0].id);

			return c.json({
				success: true,
				message: SUCCESS_CODES.USER_AUTHENTICATED,
				data: { hasProfile: profile.length > 0, userExists: true },
			});
		} else {
			// New user - return verification token for completing signup
			return c.json({
				success: true,
				data: { userExists: false, phone },
				message: SUCCESS_CODES.PHONE_VERIFIED_COMPLETE_PROFILE,
			});
		}
	} catch (error) {
		console.error("Verify OTP error:", error);
		return c.json({ error: ERROR_CODES.INTERNAL_SERVER_ERROR }, 500);
	}
});

export default verifyOtpRoute;
