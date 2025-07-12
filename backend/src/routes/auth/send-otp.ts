import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ERROR_CODES, SUCCESS_CODES } from "../../../error-codes";
import { sendOTP } from "../../lib/twilio";
import { phoneNumberSchema } from "../../lib/validation";

const sendOtpRoute = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Send OTP to phone number
 * Handles both existing users (sign-in) and new users (sign-up)
 */
sendOtpRoute.post("/", zValidator("json", phoneNumberSchema), async (c) => {
  try {
    const { phoneNumber } = c.req.valid("json");

    // Send OTP via Twilio
    const success = await sendOTP(c.env, phoneNumber);

    if (!success) {
      return c.json({ error: ERROR_CODES.OTP_SEND_FAILED }, 500);
    }

    return c.json({
      success: true,
      message: SUCCESS_CODES.OTP_SENT,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return c.json({ error: ERROR_CODES.INTERNAL_SERVER_ERROR }, 500);
  }
});

export default sendOtpRoute;
