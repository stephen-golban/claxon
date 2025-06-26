import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const DRIZZLE = Symbol("drizzle-connection");

import * as schema from "./schema";

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databasURL = configService.get<string>("DATABASE_URL");
        const pool = new Pool({
          connectionString: databasURL,
          ssl: true,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
