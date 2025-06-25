import { Injectable } from "@nestjs/common";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

@Injectable()
export class DatabaseService {
  public db: ReturnType<typeof drizzle<typeof schema>>;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    const sql = neon(databaseUrl);
    this.db = drizzle(sql, { schema });
  }

  getDatabase() {
    return this.db;
  }
}
