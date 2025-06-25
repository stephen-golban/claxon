import { Injectable, NotFoundException } from "@nestjs/common";
import { eq, asc } from "drizzle-orm";
import {
  DatabaseService,
  claxonTemplates,
  type NewClaxonTemplate,
  insertClaxonTemplateSchema,
  updateClaxonTemplateSchema,
} from "../database";
import type { CreateTemplateDto } from "./dto/create-template.dto";
import type { UpdateTemplateDto } from "./dto/update-template.dto";
import type { TemplateQueryDto } from "./dto/template-query.dto";

@Injectable()
export class ClaxonTemplatesService {
  constructor(private databaseService: DatabaseService) {}

  async create(createTemplateDto: CreateTemplateDto) {
    const db = this.databaseService.getDatabase();

    const validatedData = insertClaxonTemplateSchema
      .omit({ id: true, createdAt: true, updatedAt: true })
      .parse(createTemplateDto);

    const newTemplate: NewClaxonTemplate = validatedData;

    const [createdTemplate] = await db
      .insert(claxonTemplates)
      .values(newTemplate)
      .returning();
    return createdTemplate;
  }

  async findAll(queryDto: TemplateQueryDto) {
    const db = this.databaseService.getDatabase();

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
        message: this.getMessageByLanguage(template, language),
      }));
    }

    return filteredTemplates;
  }

  async findByCategory(category: string, queryDto: TemplateQueryDto) {
    const db = this.databaseService.getDatabase();

    const { language } = queryDto;

    const templates = await db.query.claxonTemplates.findMany({
      where: eq(claxonTemplates.category, category),
      orderBy: [asc(claxonTemplates.id)],
    });

    let responseTemplates = templates;

    // Add language-specific messages if requested
    if (language) {
      responseTemplates = templates.map((template) => ({
        ...template,
        message: this.getMessageByLanguage(template, language),
      }));
    }

    return responseTemplates;
  }

  async findOne(id: string, queryDto: TemplateQueryDto) {
    const db = this.databaseService.getDatabase();

    const { language } = queryDto;

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
        message: this.getMessageByLanguage(template, language),
      } as typeof template & { message: string };
    }

    return responseTemplate;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    const db = this.databaseService.getDatabase();

    const validatedData = updateClaxonTemplateSchema.parse(updateTemplateDto);

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
    const db = this.databaseService.getDatabase();

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
