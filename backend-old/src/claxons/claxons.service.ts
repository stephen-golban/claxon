import type { DrizzleDB } from "@/drizzle/drizzle";
import { DRIZZLE } from "@/drizzle/drizzle.module";
import {
  type NewClaxon,
  type QueryClaxon,
  type UpdateClaxon,
  claxonTemplates,
  claxons,
  insertClaxonSchema,
  updateClaxonSchema,
  users,
  vehicles,
} from "@/drizzle/schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, desc, eq, or } from "drizzle-orm";
import type { PaginationDto } from "./dto/pagination.dto";

@Injectable()
export class ClaxonsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createClaxonDto: NewClaxon, clerkId: string) {
    // Validate data
    const validatedData = insertClaxonSchema
      .omit({ id: true, senderId: true, createdAt: true, updatedAt: true })
      .parse(createClaxonDto);

    // Get sender user
    const sender = await this.db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!sender) {
      throw new NotFoundException("Sender not found");
    }

    // Verify recipient exists
    const recipient = await this.db.query.users.findFirst({
      where: eq(users.id, validatedData.recipientId),
    });

    if (!recipient) {
      throw new NotFoundException("Recipient not found");
    }

    // Verify vehicle exists and belongs to recipient
    const vehicle = await this.db.query.vehicles.findFirst({
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
      const template = await this.db.query.claxonTemplates.findFirst({
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

    const [createdClaxon] = await this.db
      .insert(claxons)
      .values(newClaxon)
      .returning();

    // Fetch the complete claxon with relations for response
    const completeClaxon = await this.db.query.claxons.findFirst({
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
    const user = await this.db.query.users.findFirst({
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

    if (type) {
      whereConditions.push(eq(claxons.type, type));
    }

    if (senderLanguage) {
      whereConditions.push(eq(claxons.senderLanguage, senderLanguage));
    }

    const userClaxons = await this.db.query.claxons.findMany({
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
    const user = await this.db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Build where conditions
    const whereConditions = [eq(claxons.senderId, user.id)];

    if (type) {
      whereConditions.push(eq(claxons.type, type));
    }

    if (senderLanguage) {
      whereConditions.push(eq(claxons.senderLanguage, senderLanguage));
    }

    const sentClaxons = await this.db.query.claxons.findMany({
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
    const user = await this.db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const claxon = await this.db.query.claxons.findFirst({
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
    // Get user to verify they exist
    const user = await this.db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const unreadClaxons = await this.db.query.claxons.findMany({
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
    const user = await this.db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if claxon exists and user is the recipient
    const existingClaxon = await this.db.query.claxons.findFirst({
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

    const [updatedClaxon] = await this.db
      .update(claxons)
      .set(updateData)
      .where(eq(claxons.id, claxonId))
      .returning();

    return updatedClaxon;
  }
}
