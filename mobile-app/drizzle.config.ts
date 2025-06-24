import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables
config({ path: ".env.local" });

if (!process.env.EXPO_PUBLIC_DATABASE_URL) {
  throw new Error("EXPO_PUBLIC_DATABASE_URL is not set");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.EXPO_PUBLIC_DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
