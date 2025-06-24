import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env.local" });

if (!process.env.EXPO_PUBLIC_DATABASE_URL) {
  throw new Error("EXPO_PUBLIC_DATABASE_URL is not set");
}

const sql = neon(process.env.EXPO_PUBLIC_DATABASE_URL);
export const db = drizzle(sql, { schema });

// Export schema types
export * from "./schema";
