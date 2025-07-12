import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middlewares";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Global middleware
app.use("*", cors());
app.use("*", logger());
app.use("*", clerkMiddleware());

app.use("*", authMiddleware);

export default app;
