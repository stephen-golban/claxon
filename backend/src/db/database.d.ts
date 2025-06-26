import type { NodePgDatabase } from "drizzle-orm/neon-http";
import type * as schema from "./schema";

export type DrizzleDB = NodePgDatabase<typeof schema>;
