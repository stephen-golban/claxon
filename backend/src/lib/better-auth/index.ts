import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "../../db/instance";
import { betterAuthOptions } from "./options";

/**
 * Better Auth Instance
 */
export const auth = (env: CloudflareBindings): ReturnType<typeof betterAuth> => {
  const db = createDb(env);

  return betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db, { provider: "pg" }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    // Additional options that depend on env ...
  });
};
