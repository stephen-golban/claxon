import type { BetterAuthOptions } from "better-auth";
import { phoneNumber } from "better-auth/plugins";

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  /**
   * The name of the application.
   */
  appName: "Claxon",
  /**
   * Base path for Better Auth.
   * @default "/api/auth"
   */
  basePath: "/api",

  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }, request) => {
        request.
      },
      
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 3,
    }),
  ],
};
