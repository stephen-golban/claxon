import { and, desc, eq, or } from "drizzle-orm";
import { z } from "zod";
import {
  type NewClaxon,
  claxonTemplates,
  claxons,
  db,
  insertClaxonSchema,
  updateClaxonSchema,
  users,
  vehicles,
} from "../../src/db";
import { createApiResponse, createErrorResponse, requireAuth } from "../../src/lib/auth-middleware";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // Check for inbox endpoint
    if (pathname.includes("/inbox")) {
      if (pathname.includes("/unread-count")) {
        return getUnreadCount(request);
      }
      return getInboxClaxons(searchParams, request);
    }

    // Check for sent endpoint
    if (pathname.includes("/sent")) {
      return getSentClaxons(searchParams, request);
    }

    // Check if it's a specific claxon by ID
    const idMatch = pathname.match(/\/claxons\/([^\/]+)$/);
    if (idMatch) {
      return getClaxonById(idMatch[1], request);
    }

    return createErrorResponse("Endpoint not found", 404);
  } catch (error) {
    console.error("Error in claxons GET:", error);
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
    const validatedData = insertClaxonSchema
      .omit({ id: true, senderId: true, createdAt: true, updatedAt: true })
      .parse(body);

    // Get sender user
    const sender = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!sender) {
      return createErrorResponse("Sender not found", 404);
    }

    // Verify recipient exists
    const recipient = await db.query.users.findFirst({
      where: eq(users.id, validatedData.recipientId),
    });

    if (!recipient) {
      return createErrorResponse("Recipient not found", 404);
    }

    // Verify vehicle exists and belongs to recipient
    const vehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.id, validatedData.vehicleId), eq(vehicles.userId, validatedData.recipientId)),
    });

    if (!vehicle) {
      return createErrorResponse("Vehicle not found or does not belong to recipient", 404);
    }

    // Verify template exists if provided
    if (validatedData.templateId) {
      const template = await db.query.claxonTemplates.findFirst({
        where: eq(claxonTemplates.id, validatedData.templateId),
      });

      if (!template) {
        return createErrorResponse("Template not found", 404);
      }
    }

    const newClaxon: NewClaxon = {
      senderId: sender.id,
      ...validatedData,
    };

    const [createdClaxon] = await db.insert(claxons).values(newClaxon).returning();

    // Fetch the complete claxon with relations for response
    const completeClaxon = await db.query.claxons.findFirst({
      where: eq(claxons.id, createdClaxon.id),
      with: {
        sender: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        recipient: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        vehicle: true,
        template: true,
      },
    });

    // TODO: Send push notification to recipient
    // await sendPushNotification(recipient, completeClaxon);

    return createApiResponse(completeClaxon, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Validation error", 400, error.errors);
    }

    console.error("Error creating claxon:", error);
    return createErrorResponse("Internal server error");
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const idMatch = pathname.match(/\/claxons\/([^\/]+)$/);

    if (!idMatch) {
      return createErrorResponse("Claxon ID required", 400);
    }

    const claxonId = idMatch[1];
    const body = await request.json();
    const validatedData = updateClaxonSchema.parse(body);

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Check if claxon exists and user is the recipient
    const existingClaxon = await db.query.claxons.findFirst({
      where: and(eq(claxons.id, claxonId), eq(claxons.recipientId, user.id)),
    });

    if (!existingClaxon) {
      return createErrorResponse("Claxon not found or you are not the recipient", 404);
    }

    const updateData = {
      ...validatedData,
      readAt: validatedData.read ? new Date() : null,
      updatedAt: new Date(),
    };

    const [updatedClaxon] = await db.update(claxons).set(updateData).where(eq(claxons.id, claxonId)).returning();

    return createApiResponse(updatedClaxon);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Validation error", 400, error.errors);
    }

    console.error("Error updating claxon:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getInboxClaxons(searchParams: URLSearchParams, request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const read = searchParams.get("read");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Build where conditions
    const whereConditions = [eq(claxons.recipientId, user.id)];

    if (read !== null) {
      whereConditions.push(eq(claxons.read, read === "true"));
    }

    const userClaxons = await db.query.claxons.findMany({
      where: and(...whereConditions),
      with: {
        sender: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            // Don't expose sensitive data
          },
        },
        vehicle: true,
        template: true,
      },
      orderBy: [desc(claxons.createdAt)],
      limit,
      offset,
    });

    return createApiResponse(userClaxons);
  } catch (error) {
    console.error("Error fetching inbox claxons:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getSentClaxons(searchParams: URLSearchParams, request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const sentClaxons = await db.query.claxons.findMany({
      where: eq(claxons.senderId, user.id),
      with: {
        recipient: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        vehicle: true,
        template: true,
      },
      orderBy: [desc(claxons.createdAt)],
      limit,
      offset,
    });

    return createApiResponse(sentClaxons);
  } catch (error) {
    console.error("Error fetching sent claxons:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getClaxonById(claxonId: string, request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const claxon = await db.query.claxons.findFirst({
      where: and(eq(claxons.id, claxonId), or(eq(claxons.senderId, user.id), eq(claxons.recipientId, user.id))),
      with: {
        sender: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        recipient: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        vehicle: true,
        template: true,
      },
    });

    if (!claxon) {
      return createErrorResponse("Claxon not found", 404);
    }

    return createApiResponse(claxon);
  } catch (error) {
    console.error("Error fetching claxon:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getUnreadCount(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const unreadClaxons = await db.query.claxons.findMany({
      where: and(eq(claxons.recipientId, user.id), eq(claxons.read, false)),
    });

    return createApiResponse({ count: unreadClaxons.length });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return createErrorResponse("Internal server error");
  }
}
