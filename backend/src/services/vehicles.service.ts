import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
	insertVehicleSchema,
	type NewVehicle,
	type QueryVehicle,
	type UpdateVehicle,
	updateVehicleSchema,
	users,
	vehicles,
} from "../db/schema";

export class VehiclesService {
	async create(createVehicleDto: NewVehicle, clerkId: string) {
		// Validate data
		const validatedData = insertVehicleSchema
			.omit({ id: true, userId: true, createdAt: true, updatedAt: true })
			.parse(createVehicleDto);

		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
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

	async findAllByUser(clerkId: string, dto?: QueryVehicle) {
		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Build where conditions
		const whereConditions = [eq(vehicles.userId, user.id)];

		if (dto?.brand) {
			whereConditions.push(eq(vehicles.brand, dto.brand));
		}

		if (dto?.model) {
			whereConditions.push(eq(vehicles.model, dto.model));
		}

		if (dto?.color) {
			whereConditions.push(eq(vehicles.color, dto.color));
		}

		if (dto?.plateType) {
			whereConditions.push(eq(vehicles.plateType, dto.plateType));
		}

		if (dto?.plateCountry) {
			whereConditions.push(eq(vehicles.plateCountry, dto.plateCountry));
		}

		if (dto?.isActive !== undefined && dto.isActive !== null) {
			whereConditions.push(eq(vehicles.isActive, dto.isActive));
		}

		const userVehicles = await db.query.vehicles.findMany({
			where: and(...whereConditions),
			orderBy: [desc(vehicles.createdAt)],
		});

		return userVehicles;
	}

	async findOne(vehicleId: string, clerkId: string) {
		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		const vehicle = await db.query.vehicles.findFirst({
			where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
		});

		if (!vehicle) {
			throw new Error("Vehicle not found");
		}

		return vehicle;
	}

	async searchByPlate(plateNumber: string) {
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
			throw new Error("Vehicle not found or not active");
		}

		return vehicle;
	}

	async update(
		vehicleId: string,
		updateVehicleDto: UpdateVehicle,
		clerkId: string,
	) {
		const validatedData: UpdateVehicle =
			updateVehicleSchema.parse(updateVehicleDto);

		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Check if vehicle exists and belongs to user
		const existingVehicle = await db.query.vehicles.findFirst({
			where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
		});

		if (!existingVehicle) {
			throw new Error("Vehicle not found");
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
		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Check if vehicle exists and belongs to user
		const existingVehicle = await db.query.vehicles.findFirst({
			where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)),
		});

		if (!existingVehicle) {
			throw new Error("Vehicle not found");
		}

		await db
			.delete(vehicles)
			.where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)));
	}
}

export const vehiclesService = new VehiclesService();
