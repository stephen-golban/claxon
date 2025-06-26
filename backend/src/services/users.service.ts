import { eq } from "drizzle-orm";
import { db } from "../db";
import {
	insertUserSchema,
	type NewUser,
	type UpdateUser,
	updateUserSchema,
	users,
} from "../db/schema";
import { ConflictError, NotFoundError } from "../utils/errors";

export class UsersService {
	async create(createUserDto: NewUser, clerkId: string) {
		// Validate data
		const validatedData = insertUserSchema
			.omit({ id: true, clerkId: true, createdAt: true, updatedAt: true })
			.parse(createUserDto);

		// Check if user already exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (existingUser) {
			throw new ConflictError("User already exists");
		}

		// Check for duplicate phone
		const existingPhone = await db.query.users.findFirst({
			where: eq(users.phone, validatedData.phone),
		});

		if (existingPhone) {
			throw new ConflictError("Phone number already taken");
		}

		// Check for duplicate email
		const existingEmail = await db.query.users.findFirst({
			where: eq(users.email, validatedData.email),
		});

		if (existingEmail) {
			throw new ConflictError("Email already taken");
		}

		const newUser: NewUser = {
			id: clerkId,
			clerkId: clerkId,
			...validatedData,
			privacySettings: validatedData.privacySettings
				? JSON.stringify(validatedData.privacySettings)
				: null,
			notificationPreferences: validatedData.notificationPreferences
				? JSON.stringify(validatedData.notificationPreferences)
				: null,
		};

		const [createdUser] = await db.insert(users).values(newUser).returning();
		return createdUser;
	}

	async findByClerkId(clerkId: string) {
		const user = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!user) {
			throw new NotFoundError("User");
		}

		return user;
	}

	async update(clerkId: string, updateUserDto: UpdateUser) {
		const validatedData: UpdateUser = updateUserSchema.parse(updateUserDto);

		const existingUser = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!existingUser) {
			throw new NotFoundError("User");
		}

		const updateData = {
			...validatedData,
			privacySettings: validatedData.privacySettings
				? JSON.stringify(validatedData.privacySettings)
				: undefined,
			notificationPreferences: validatedData.notificationPreferences
				? JSON.stringify(validatedData.notificationPreferences)
				: undefined,
			updatedAt: new Date(),
		};

		const [updatedUser] = await db
			.update(users)
			.set(updateData)
			.where(eq(users.clerkId, clerkId))
			.returning();
		return updatedUser;
	}

	async remove(clerkId: string) {
		const existingUser = await db.query.users.findFirst({
			where: eq(users.clerkId, clerkId),
		});

		if (!existingUser) {
			throw new NotFoundError("User");
		}

		await db.delete(users).where(eq(users.clerkId, clerkId));
	}
}

export const usersService = new UsersService();
