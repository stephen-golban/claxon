import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { verifyToken } from "@clerk/backend";
import { Strategy } from "passport-custom";
import type { AuthenticatedUser } from "./current-user.decorator";
import type { Request } from "express";

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, "clerk") {
  constructor() {
    super();
  }

  async validate(req: Request): Promise<AuthenticatedUser> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedException("No valid authorization header");
      }

      const token = authHeader.replace("Bearer ", "");
      const secretKey = process.env.CLERK_SECRET_KEY;

      if (!secretKey) {
        throw new Error("CLERK_SECRET_KEY is not set");
      }

      const verifiedToken = await verifyToken(token, {
        secretKey,
      });

      if (verifiedToken.errors) {
        console.error("Token verification failed:", verifiedToken.errors);
        throw new UnauthorizedException("Invalid token");
      }

      return {
        userId: verifiedToken.sub,
        sessionId: verifiedToken.sid,
      };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new UnauthorizedException("Authentication failed");
    }
  }
}
