import { and, desc, eq, or } from "drizzle-orm";
import { db } from "../db";
import {
	claxons,
	claxonTemplates,
	insertClaxonSchema,
	type NewClaxon,
	type UpdateClaxon,
	updateClaxonSchema,
	users,
	vehicles,
} from "../db/schema";

export interface QueryClaxon {
	read?: string;
	type?: string;
	senderLanguage?: string;
}

export interface PaginationDto {
	limit?: number;
	offset?: number;
}

export class ClaxonsService {
	async create(createClaxonDto: NewClaxon, clerkId: string) {
		// Validate data
		const validatedData = insertClaxonSchema
			.omit({ id: true, senderId: true, createdAt: true, updatedAt: true })
			.parse(createClaxonDto);

		// Get sender user
		const sender = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!sender) {
			throw new Error("Sender not found");
		}

		// Verify recipient exists
		const recipient = await db.query.users.findFirst({
			where: eq(users.id, validatedData.recipientId),
		});

		if (!recipient) {
			throw new Error("Recipient not found");
		}

		// Verify vehicle exists and belongs to recipient
		const vehicle = await db.query.vehicles.findFirst({
			where: and(
				eq(vehicles.id, validatedData.vehicleId),
				eq(vehicles.userId, validatedData.recipientId),
			),
		});

		if (!vehicle) {
			throw new Error("Vehicle not found or does not belong to recipient");
		}

		// Verify template exists if provided
		if (validatedData.templateId) {
			const template = await db.query.claxonTemplates.findFirst({
				where: eq(claxonTemplates.id, validatedData.templateId),
			});

			if (!template) {
				throw new Error("Template not found");
			}
		}

		const newClaxon: NewClaxon = {
			senderId: sender.id,
			...validatedData,
		};

		const [createdClaxon] = await db
			.insert(claxons)
			.values(newClaxon)
			.returning();

		// Fetch the complete claxon with relations for response
		const completeClaxon = await db.query.claxons.findFirst({
			where: eq(claxons.id, createdClaxon?.id),
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

		return completeClaxon;
	}

	async findInbox(
		clerkId: string,
		paginationDto: PaginationDto & Partial<QueryClaxon>,
	) {
		const {
			read,
			type,
			senderLanguage,
			limit = 20,
			offset = 0,
		} = paginationDto;

		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Build where conditions
		const whereConditions = [eq(claxons.recipientId, user.id)];

		if (read !== null && read !== undefined) {
			whereConditions.push(eq(claxons.read, read === "true"));
		}

		if (type) {
			whereConditions.push(eq(claxons.type, type));
		}

		if (senderLanguage) {
			whereConditions.push(eq(claxons.senderLanguage, senderLanguage));
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

		return userClaxons;
	}

	async findSent(
		clerkId: string,
		paginationDto: PaginationDto & Partial<QueryClaxon>,
	) {
		const { type, senderLanguage, limit = 20, offset = 0 } = paginationDto;

		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Build where conditions
		const whereConditions = [eq(claxons.senderId, user.id)];

		if (type) {
			whereConditions.push(eq(claxons.type, type));
		}

		if (senderLanguage) {
			whereConditions.push(eq(claxons.senderLanguage, senderLanguage));
		}

		const sentClaxons = await db.query.claxons.findMany({
			where: and(...whereConditions),
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

		return sentClaxons;
	}

	async findOne(claxonId: string, clerkId: string) {
		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		const claxon = await db.query.claxons.findFirst({
			where: and(
				eq(claxons.id, claxonId),
				or(eq(claxons.senderId, user.id), eq(claxons.recipientId, user.id)),
			),
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
			throw new Error("Claxon not found");
		}

		return claxon;
	}

	async getUnreadCount(clerkId: string) {
		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		const unreadClaxons = await db.query.claxons.findMany({
			where: and(eq(claxons.recipientId, user.id), eq(claxons.read, false)),
		});

		return { count: unreadClaxons.length };
	}

	async update(
		claxonId: string,
		updateClaxonDto: UpdateClaxon,
		clerkId: string,
	) {
		const validatedData: UpdateClaxon =
			updateClaxonSchema.parse(updateClaxonDto);

		// Get user to verify they exist
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Check if claxon exists and user is the recipient
		const existingClaxon = await db.query.claxons.findFirst({
			where: and(eq(claxons.id, claxonId), eq(claxons.recipientId, user.id)),
		});

		if (!existingClaxon) {
			throw new Error("Claxon not found or you are not the recipient");
		}

		const updateData = {
			...validatedData,
			readAt: validatedData.read ? new Date() : null,
			updatedAt: new Date(),
		};

		const [updatedClaxon] = await db
			.update(claxons)
			.set(updateData)
			.where(eq(claxons.id, claxonId))
			.returning();

		return updatedClaxon;
	}
}

export const claxonsService = new ClaxonsService();
