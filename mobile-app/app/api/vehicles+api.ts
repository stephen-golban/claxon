import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { type NewVehicle, db, insertVehicleSchema, updateVehicleSchema, users, vehicles } from "../../src/db";
import { createApiResponse, createErrorResponse, requireAuth } from "../../src/lib/auth-middleware";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if it's a search endpoint
    const searchMatch = pathname.match(/\/search\/([^\/]+)$/);
    if (searchMatch) {
      return searchVehicleByPlate(searchMatch[1], request);
    }

    // Check if it's a specific vehicle by ID
    const idMatch = pathname.match(/\/vehicles\/([^\/]+)$/);
    if (idMatch) {
      return getVehicleById(idMatch[1], request);
    }

    // Get all vehicles for user
    return getUserVehicles(request);
  } catch (error) {
    console.error("Error in vehicles GET:", error);
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
    const validatedData = insertVehicleSchema
      .omit({ id: true, userId: true, createdAt: true, updatedAt: true })
      .parse(body);

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const newVehicle: NewVehicle = {
      userId: user.id,
      ...validatedData,
    };

    const [createdVehicle] = await db.insert(vehicles).values(newVehicle).returning();

    return createApiResponse(createdVehicle, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Validation error", 400, error.errors);
    }

    console.error("Error creating vehicle:", error);
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
    const idMatch = pathname.match(/\/vehicles\/([^\/]+)$/);

    if (!idMatch) {
      return createErrorResponse("Vehicle ID required", 400);
    }

    const vehicleId = idMatch[1];
    const body = await request.json();
    const validatedData = updateVehicleSchema.parse(body);

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Check if vehicle exists and belongs to user
    const existingVehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
    });

    if (!existingVehicle) {
      return createErrorResponse("Vehicle not found", 404);
    }

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const [updatedVehicle] = await db
      .update(vehicles)
      .set(updateData)
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)))
      .returning();

    return createApiResponse(updatedVehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Validation error", 400, error.errors);
    }

    console.error("Error updating vehicle:", error);
    return createErrorResponse("Internal server error");
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const idMatch = pathname.match(/\/vehicles\/([^\/]+)$/);

    if (!idMatch) {
      return createErrorResponse("Vehicle ID required", 400);
    }

    const vehicleId = idMatch[1];

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, auth.userId),
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Check if vehicle exists and belongs to user
    const existingVehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
    });

    if (!existingVehicle) {
      return createErrorResponse("Vehicle not found", 404);
    }

    await db.delete(vehicles).where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getUserVehicles(request: Request) {
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

    const userVehicles = await db.query.vehicles.findMany({
      where: eq(vehicles.userId, user.id),
      orderBy: (vehicles, { desc }) => [desc(vehicles.createdAt)],
    });

    return createApiResponse(userVehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getVehicleById(vehicleId: string, request: Request) {
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

    const vehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
    });

    if (!vehicle) {
      return createErrorResponse("Vehicle not found", 404);
    }

    return createApiResponse(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return createErrorResponse("Internal server error");
  }
}

async function searchVehicleByPlate(plateNumber: string, request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const vehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.plateNumber, plateNumber.toUpperCase()), eq(vehicles.isActive, true)),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            // Don't expose sensitive data
          },
        },
      },
    });

    if (!vehicle) {
      return createErrorResponse("Vehicle not found or not active", 404);
    }

    return createApiResponse(vehicle);
  } catch (error) {
    console.error("Error searching vehicle:", error);
    return createErrorResponse("Internal server error");
  }
}
