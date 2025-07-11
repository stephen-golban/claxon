import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Create database instance with environment-specific connection
 */
export const createDb = (env: CloudflareBindings) => {
  const sql = neon(env.DATABASE_URL);
  return drizzle(sql, { schema });
};

export type Database = ReturnType<typeof createDb>;
