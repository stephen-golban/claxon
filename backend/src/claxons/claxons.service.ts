import { Injectable, NotFoundException } from "@nestjs/common";
import { and, desc, eq, or } from "drizzle-orm";
import {
  DatabaseService,
  claxons,
  claxonTemplates,
  users,
  vehicles,
  type NewClaxon,
  insertClaxonSchema,
  updateClaxonSchema,
} from "../database";
import type { CreateClaxonDto } from "./dto/create-claxon.dto";
import type { UpdateClaxonDto } from "./dto/update-claxon.dto";
import type { PaginationDto } from "./dto/pagination.dto";

@Injectable()
export class ClaxonsService {
  constructor(private databaseService: DatabaseService) {}

  async create(createClaxonDto: CreateClaxonDto, clerkId: string) {
    const db = this.databaseService.getDatabase();

    // Validate data
    const validatedData = insertClaxonSchema
      .omit({ id: true, senderId: true, createdAt: true, updatedAt: true })
      .parse(createClaxonDto);

    // Get sender user
    const sender = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!sender) {
      throw new NotFoundException("Sender not found");
    }

    // Verify recipient exists
    const recipient = await db.query.users.findFirst({
      where: eq(users.id, validatedData.recipientId),
    });

    if (!recipient) {
      throw new NotFoundException("Recipient not found");
    }

    // Verify vehicle exists and belongs to recipient
    const vehicle = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.id, validatedData.vehicleId),
        eq(vehicles.userId, validatedData.recipientId),
      ),
    });

    if (!vehicle) {
      throw new NotFoundException(
        "Vehicle not found or does not belong to recipient",
      );
    }

    // Verify template exists if provided
    if (validatedData.templateId) {
      const template = await db.query.claxonTemplates.findFirst({
        where: eq(claxonTemplates.id, validatedData.templateId),
      });

      if (!template) {
        throw new NotFoundException("Template not found");
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

    return completeClaxon;
  }

  async findInbox(clerkId: string, paginationDto: PaginationDto) {
    const db = this.databaseService.getDatabase();

    const { read, limit = 20, offset = 0 } = paginationDto;

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Build where conditions
    const whereConditions = [eq(claxons.recipientId, user.id)];

    if (read !== null && read !== undefined) {
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

    return userClaxons;
  }

  async findSent(clerkId: string, paginationDto: PaginationDto) {
    const db = this.databaseService.getDatabase();

    const { limit = 20, offset = 0 } = paginationDto;

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
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

    return sentClaxons;
  }

  async findOne(claxonId: string, clerkId: string) {
    const db = this.databaseService.getDatabase();

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
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
      throw new NotFoundException("Claxon not found");
    }

    return claxon;
  }

  async getUnreadCount(clerkId: string) {
    const db = this.databaseService.getDatabase();

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const unreadClaxons = await db.query.claxons.findMany({
      where: and(eq(claxons.recipientId, user.id), eq(claxons.read, false)),
    });

    return { count: unreadClaxons.length };
  }

  async update(
    claxonId: string,
    updateClaxonDto: UpdateClaxonDto,
    clerkId: string,
  ) {
    const db = this.databaseService.getDatabase();

    const validatedData = updateClaxonSchema.parse(updateClaxonDto);

    // Get user to verify they exist
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if claxon exists and user is the recipient
    const existingClaxon = await db.query.claxons.findFirst({
      where: and(eq(claxons.id, claxonId), eq(claxons.recipientId, user.id)),
    });

    if (!existingClaxon) {
      throw new NotFoundException(
        "Claxon not found or you are not the recipient",
      );
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
