export * from "./account";
export * from "./profile";
export * from "./session";
export * from "./user";
export * from "./verification";

import { account } from "./account";
import { profile } from "./profile";
import { session } from "./session";
import { user } from "./user";
import { verification } from "./verification";

export const schema = { user, profile, account, session, verification };
