import type { DrizzleDB } from "@/drizzle/drizzle";
import { DRIZZLE } from "@/drizzle/drizzle.module";
import {
  type NewUser,
  type UpdateUser,
  insertUserSchema,
  updateUserSchema,
  users,
} from "@/drizzle/schema";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createUserDto: NewUser, clerkId: string) {
    // Validate data
    const validatedData = insertUserSchema
      .omit({ id: true, clerkId: true, createdAt: true, updatedAt: true })
      .parse(createUserDto);

    // Check if user already exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    // Check for duplicate phone
    const existingPhone = await this.db.query.users.findFirst({
      where: eq(users.phone, validatedData.phone),
    });

    if (existingPhone) {
      throw new ConflictException("Phone number already taken");
    }

    // Check for duplicate email
    const existingEmail = await this.db.query.users.findFirst({
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

    const [createdUser] = await this.db
      .insert(users)
      .values(newUser)
      .returning();
    return createdUser;
  }

  async findByClerkId(clerkId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async update(clerkId: string, updateUserDto: UpdateUser) {
    const validatedData: UpdateUser = updateUserSchema.parse(updateUserDto);

    const existingUser = await this.db.query.users.findFirst({
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

    const [updatedUser] = await this.db
      .update(users)
      .set(updateData)
      .where(eq(users.clerkId, clerkId))
      .returning();
    return updatedUser;
  }

  async remove(clerkId: string) {
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    await this.db.delete(users).where(eq(users.clerkId, clerkId));
  }
}
