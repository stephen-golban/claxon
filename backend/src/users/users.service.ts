import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import {
  DatabaseService,
  users,
  type NewUser,
  insertUserSchema,
  updateUserSchema,
} from "../database";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto, clerkId: string) {
    const db = this.databaseService.getDatabase();

    // Validate data
    const validatedData = insertUserSchema
      .omit({ id: true, clerkId: true, createdAt: true, updatedAt: true })
      .parse(createUserDto);

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    // Check for duplicate phone
    const existingPhone = await db.query.users.findFirst({
      where: eq(users.phone, validatedData.phone),
    });

    if (existingPhone) {
      throw new ConflictException("Phone number already taken");
    }

    // Check for duplicate email
    const existingEmail = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingEmail) {
      throw new ConflictException("Email already taken");
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
    const db = this.databaseService.getDatabase();

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async update(clerkId: string, updateUserDto: UpdateUserDto) {
    const db = this.databaseService.getDatabase();

    const validatedData = updateUserSchema.parse(updateUserDto);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!existingUser) {
      throw new NotFoundException("User not found");
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
    const db = this.databaseService.getDatabase();

    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    await db.delete(users).where(eq(users.clerkId, clerkId));
  }
}
