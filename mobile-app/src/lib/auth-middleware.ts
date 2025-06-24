import { verifyToken } from "@clerk/backend";

export interface AuthenticatedUser {
  userId: string;
  sessionId: string;
}

export async function requireAuth(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");

    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error("CLERK_SECRET_KEY is not set");
    }

    const verifiedToken = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (verifiedToken.errors) {
      console.error("Token verification failed:", verifiedToken.errors);
      return null;
    }

    return {
      userId: verifiedToken.sub,
      sessionId: verifiedToken.sid,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export function createApiResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function createErrorResponse(message: string, status = 500, details?: unknown) {
  const response = { error: message } as Record<string, unknown>;
  if (details) {
    response.details = details;
  }
  return Response.json(response, { status });
}
