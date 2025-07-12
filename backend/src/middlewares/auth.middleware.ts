import { getAuth } from "@hono/clerk-auth";
import type { MiddlewareHandler } from "hono";
import { ERROR_CODES } from "../lib/constants";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const auth = getAuth(c);

  if (!auth) {
    return c.json({ success: false, code: ERROR_CODES.INTERNAL_SERVER_ERROR }, 500);
  }

  const isAuthorized = auth.isAuthenticated && auth.userId;

  if (!isAuthorized) {
    return c.json({ success: false, code: ERROR_CODES.UNAUTHORIZED }, 401);
  }

  c.set("auth", auth);
  await next();
};
