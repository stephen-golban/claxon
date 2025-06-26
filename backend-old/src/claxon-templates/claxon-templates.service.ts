import type { DrizzleDB } from "@/drizzle/drizzle";
import { DRIZZLE } from "@/drizzle/drizzle.module";
import {
  type NewClaxonTemplate,
  type QueryClaxonTemplate,
  type UpdateClaxonTemplate,
  claxonTemplates,
  insertClaxonTemplateSchema,
  queryClaxonTemplateSchema,
  updateClaxonTemplateSchema,
} from "@/drizzle/schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { asc, eq } from "drizzle-orm";

@Injectable()
export class ClaxonTemplatesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(dto: NewClaxonTemplate) {
    const db = this.db;

    const validatedData = insertClaxonTemplateSchema
      .omit({ id: true, createdAt: true, updatedAt: true })
      .parse(dto);

    const newTemplate: NewClaxonTemplate = validatedData;

    const [createdTemplate] = await db
      .insert(claxonTemplates)
      .values(newTemplate)
      .returning();
    return createdTemplate;
  }

  async findAll(queryDto: QueryClaxonTemplate) {
    const db = this.db;

    const { category, language } = queryDto;

    const query = db.query.claxonTemplates.findMany({
      where: eq(claxonTemplates.isActive, true),
      orderBy: [asc(claxonTemplates.category)],
    });

    const templates = await query;

    // Filter by category if provided
    let filteredTemplates = templates;
    if (category) {
      filteredTemplates = templates.filter((t) => t.category === category);
    }

    // Transform messages based on language preference
    if (language) {
      filteredTemplates = filteredTemplates.map((template) => ({
        ...template,
        message: this.getMessageByLanguage(
          template,
          language as "en" | "ro" | "ru",
        ),
      }));
    }

    return filteredTemplates;
  }

  async findByCategory(category: string, dto: QueryClaxonTemplate) {
    const db = this.db;

    const validatedDto = queryClaxonTemplateSchema.parse(dto);

    const { language } = validatedDto;

    const templates = await db.query.claxonTemplates.findMany({
      where: eq(claxonTemplates.category, category),
      orderBy: [asc(claxonTemplates.id)],
    });

    let responseTemplates = templates;

    // Add language-specific messages if requested
    if (language) {
      responseTemplates = templates.map((template) => ({
        ...template,
        message: this.getMessageByLanguage(
          template,
          language as "en" | "ro" | "ru",
        ),
      }));
    }

    return responseTemplates;
  }

  async findOne(id: string, dto: QueryClaxonTemplate) {
    const db = this.db;

    const validatedDto = queryClaxonTemplateSchema.parse(dto);

    const { language } = validatedDto;

    const template = await db.query.claxonTemplates.findFirst({
      where: eq(claxonTemplates.id, id),
    });

    if (!template) {
      throw new NotFoundException("Template not found");
    }

    let responseTemplate = { ...template };

    // Add language-specific message if requested
    if (language) {
      responseTemplate = {
        ...responseTemplate,
        message: this.getMessageByLanguage(
          template,
          language as "en" | "ro" | "ru",
        ),
      } as typeof template & { message: string };
    }

    return responseTemplate;
  }

  async update(id: string, dto: UpdateClaxonTemplate) {
    const db = this.db;

    const validatedData = updateClaxonTemplateSchema.parse(dto);

    const existingTemplate = await db.query.claxonTemplates.findFirst({
      where: eq(claxonTemplates.id, id),
    });

    if (!existingTemplate) {
      throw new NotFoundException("Template not found");
    }

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const [updatedTemplate] = await db
      .update(claxonTemplates)
      .set(updateData)
      .where(eq(claxonTemplates.id, id))
      .returning();

    return updatedTemplate;
  }

  async remove(id: string) {
    const db = this.db;

    const existingTemplate = await db.query.claxonTemplates.findFirst({
      where: eq(claxonTemplates.id, id),
    });

    if (!existingTemplate) {
      throw new NotFoundException("Template not found");
    }

    await db.delete(claxonTemplates).where(eq(claxonTemplates.id, id));
  }

  // Helper function to get message by language
  private getMessageByLanguage(
    template: typeof claxonTemplates.$inferSelect,
    language: "en" | "ro" | "ru",
  ): string {
    switch (language) {
      case "en":
        return template.messageEn;
      case "ro":
        return template.messageRo;
      case "ru":
        return template.messageRu;
      default:
        return template.messageRo; // Default to Romanian
    }
  }
}
