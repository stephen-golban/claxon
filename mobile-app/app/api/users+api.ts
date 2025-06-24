import { eq } from "drizzle-orm";
import { z } from "zod";
import { type NewUser, db, insertUserSchema, updateUserSchema, users } from "../../src/db";
import { createApiResponse, createErrorResponse, requireAuth } from "../../src/lib/auth-middleware";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if it's the current user endpoint
    if (pathname.endsWith("/current")) {
      return getCurrentUser(request);
    }

    // Check if it's by clerk ID
    const clerkIdMatch = pathname.match(/\/by-clerk-id\/([^\/]+)$/);
    if (clerkIdMatch) {
      return getUserByClerkId(clerkIdMatch[1], request);
    }

    return createErrorResponse("Endpoint not found", 404);
  } catch (error) {
    console.error("Error in users GET:", error);
    return createErrorResponse("Internal server error");
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validatedData = insertUserSchema
      .omit({ id: true, clerkId: true, createdAt: true, updatedAt: true })
      .parse(body);

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (existingUser) {
      return createErrorResponse("User already exists", 409);
    }

    // Check for duplicate phone
    const existingPhone = await db.query.users.findFirst({
      where: eq(users.phone, validatedData.phone),
    });

    if (existingPhone) {
      return createErrorResponse("Phone number already taken", 409);
    }

    // Check for duplicate email
    const existingEmail = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingEmail) {
      return createErrorResponse("Email already taken", 409);
    }

    const newUser: NewUser = {
      id: auth.userId,
      clerkId: auth.userId,
      ...validatedData,
      privacySettings: validatedData.privacySettings ? JSON.stringify(validatedData.privacySettings) : null,
      notificationPreferences: validatedData.notificationPreferences
        ? JSON.stringify(validatedData.notificationPreferences)
        : null,
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    return createApiResponse(createdUser, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Validation error", 400, error.errors);
    }

    console.error("Error creating user:", error);
    return createErrorResponse("Internal server error");
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!existingUser) {
      return createErrorResponse("User not found", 404);
    }

    const updateData = {
      ...validatedData,
      privacySettings: validatedData.privacySettings ? JSON.stringify(validatedData.privacySettings) : undefined,
      notificationPreferences: validatedData.notificationPreferences
        ? JSON.stringify(validatedData.notificationPreferences)
        : undefined,
      updatedAt: new Date(),
    };

    const [updatedUser] = await db.update(users).set(updateData).where(eq(users.clerkId, auth.userId)).returning();

    return createApiResponse(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Validation error", 400, error.errors);
    }

    console.error("Error updating user:", error);
    return createErrorResponse("Internal server error");
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!existingUser) {
      return createErrorResponse("User not found", 404);
    }

    await db.delete(users).where(eq(users.clerkId, auth.userId));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getCurrentUser(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    return createApiResponse(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getUserByClerkId(clerkId: string, request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    return createApiResponse(user);
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    return createErrorResponse("Internal server error");
  }
}
