import { Twilio } from "twilio";

/**
 * Twilio client instance
 */
export const createTwilioClient = (env: CloudflareBindings) => {
  return new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
};

/**
 * Send OTP via Twilio Verify API
 */
export const sendOTP = async (env: CloudflareBindings, to: string): Promise<boolean> => {
  try {
    const client = createTwilioClient(env);

    const verification = await client.verify.v2.services(env.TWILIO_VERIFY_SERVICE_SID).verifications.create({
      to,
      channel: "sms",
    });

    return verification.status === "pending";
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return false;
  }
};

/**
 * Verify OTP via Twilio Verify API
 */
export const verifyOTP = async (env: CloudflareBindings, to: string, code: string): Promise<boolean> => {
  try {
    const client = createTwilioClient(env);

    const verificationCheck = await client.verify.v2.services(env.TWILIO_VERIFY_SERVICE_SID).verificationChecks.create({
      to,
      code: code,
    });

    return verificationCheck.status === "approved";
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    return false;
  }
};
