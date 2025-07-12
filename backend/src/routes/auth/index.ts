import { Hono } from "hono";
import completeSignupRoute from "./complete-signup";
import sendOtpRoute from "./send-otp";
import verifyOtpRoute from "./verify-otp";

const authRoutes = new Hono<{ Bindings: CloudflareBindings }>();

authRoutes.route("/send-otp", sendOtpRoute);
authRoutes.route("/verify-otp", verifyOtpRoute);
authRoutes.route("/complete-signup", completeSignupRoute);

export default authRoutes;
