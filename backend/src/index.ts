import { Hono } from "hono";
import { auth } from "./lib/better-auth";
import authRoutes from "./routes/auth";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Custom auth routes
app.route("/api/auth", authRoutes);

// Better Auth routes (for other auth functionality)
app.on(["GET", "POST"], "/api/*", (c) => {
  return auth(c.env).handler(c.req.raw);
});

export default app;
