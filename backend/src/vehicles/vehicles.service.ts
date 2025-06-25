import { Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, desc } from "drizzle-orm";
import {
  DatabaseService,
  vehicles,
  users,
  type NewVehicle,
  insertVehicleSchema,
  updateVehicleSchema,
} from "../database";
import type { CreateVehicleDto } from "./dto/create-vehicle.dto";
import type { UpdateVehicleDto } from "./dto/update-vehicle.dto";

@Injectable()
export class VehiclesService {
  constructor(private databaseService: DatabaseService) {}

  async create(createVehicleDto: CreateVehicleDto, clerkId: string) {
    const db = this.databaseService.getDatabase();

    // Validate data
    const validatedData = insertVehicleSchema
      .omit({ id: true, userId: true, createdAt: true, updatedAt: true })
      .parse(createVehicleDto);

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const newVehicle: NewVehicle = {
      userId: user.id,
      ...validatedData,
    };

    const [createdVehicle] = await db
      .insert(vehicles)
      .values(newVehicle)
      .returning();
    return createdVehicle;
  }

  async findAllByUser(clerkId: string) {
    const db = this.databaseService.getDatabase();

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userVehicles = await db.query.vehicles.findMany({
      where: eq(vehicles.userId, user.id),
      orderBy: [desc(vehicles.createdAt)],
    });

    return userVehicles;
  }

  async findOne(vehicleId: string, clerkId: string) {
    const db = this.databaseService.getDatabase();

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const vehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
    });

    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }

    return vehicle;
  }

  async searchByPlate(plateNumber: string) {
    const db = this.databaseService.getDatabase();

    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.plateNumber, plateNumber.toUpperCase()),
        eq(vehicles.isActive, true),
      ),
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
      throw new NotFoundException("Vehicle not found or not active");
    }

    return vehicle;
  }

  async update(
    vehicleId: string,
    updateVehicleDto: UpdateVehicleDto,
    clerkId: string,
  ) {
    const db = this.databaseService.getDatabase();

    const validatedData = updateVehicleSchema.parse(updateVehicleDto);

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if vehicle exists and belongs to user
    const existingVehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
    });

    if (!existingVehicle) {
      throw new NotFoundException("Vehicle not found");
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

    return updatedVehicle;
  }

  async remove(vehicleId: string, clerkId: string) {
    const db = this.databaseService.getDatabase();

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if vehicle exists and belongs to user
    const existingVehicle = await db.query.vehicles.findFirst({
      where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
    });

    if (!existingVehicle) {
      throw new NotFoundException("Vehicle not found");
    }

    await db
      .delete(vehicles)
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)));
  }
}
