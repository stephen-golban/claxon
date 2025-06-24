import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  type NewClaxonTemplate,
  claxonTemplates,
  db,
  insertClaxonTemplateSchema,
  updateClaxonTemplateSchema,
} from "../../src/db";
import { createApiResponse, createErrorResponse, requireAuth } from "../../src/lib/auth-middleware";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // Check for category endpoint
    const categoryMatch = pathname.match(/\/category\/([^\/]+)$/);
    if (categoryMatch) {
      return getTemplatesByCategory(categoryMatch[1], searchParams);
    }

    // Check if it's a specific template by ID
    const idMatch = pathname.match(/\/claxon-templates\/([^\/]+)$/);
    if (idMatch) {
      return getTemplateById(idMatch[1], searchParams);
    }

    // Get all templates
    return getAllTemplates(searchParams);
  } catch (error) {
    console.error("Error in claxon-templates GET:", error);
    return createErrorResponse("Internal server error");
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validatedData = insertClaxonTemplateSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(body);

    const newTemplate: NewClaxonTemplate = validatedData;

    const [createdTemplate] = await db.insert(claxonTemplates).values(newTemplate).returning();

    return createApiResponse(createdTemplate, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Validation error", 400, error.errors);
    }

    console.error("Error creating template:", error);
    return createErrorResponse("Internal server error");
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const idMatch = pathname.match(/\/claxon-templates\/([^\/]+)$/);

    if (!idMatch) {
      return createErrorResponse("Template ID required", 400);
    }

    const templateId = idMatch[1];
    const body = await request.json();
    const validatedData = updateClaxonTemplateSchema.parse(body);

    const existingTemplate = await db.query.claxonTemplates.findFirst({
      where: eq(claxonTemplates.id, templateId),
    });

    if (!existingTemplate) {
      return createErrorResponse("Template not found", 404);
    }

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const [updatedTemplate] = await db
      .update(claxonTemplates)
      .set(updateData)
      .where(eq(claxonTemplates.id, templateId))
      .returning();

    return createApiResponse(updatedTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Validation error", 400, error.errors);
    }

    console.error("Error updating template:", error);
    return createErrorResponse("Internal server error");
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return createErrorResponse("Unauthorized", 401);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const idMatch = pathname.match(/\/claxon-templates\/([^\/]+)$/);

    if (!idMatch) {
      return createErrorResponse("Template ID required", 400);
    }

    const templateId = idMatch[1];

    const existingTemplate = await db.query.claxonTemplates.findFirst({
      where: eq(claxonTemplates.id, templateId),
    });

    if (!existingTemplate) {
      return createErrorResponse("Template not found", 404);
    }

    await db.delete(claxonTemplates).where(eq(claxonTemplates.id, templateId));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting template:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getAllTemplates(searchParams: URLSearchParams) {
  try {
    const category = searchParams.get("category");
    const language = searchParams.get("language");

    const query = db.query.claxonTemplates.findMany({
      where: eq(claxonTemplates.isActive, true),
      orderBy: (claxonTemplates, { asc }) => [asc(claxonTemplates.category)],
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
        message: getMessageByLanguage(template, language as "en" | "ro" | "ru"),
      }));
    }

    return createApiResponse(filteredTemplates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getTemplateById(templateId: string, searchParams: URLSearchParams) {
  try {
    const language = searchParams.get("language");

    const template = await db.query.claxonTemplates.findFirst({
      where: eq(claxonTemplates.id, templateId),
    });

    if (!template) {
      return createErrorResponse("Template not found", 404);
    }

    let responseTemplate = { ...template };

    // Add language-specific message if requested
    if (language) {
      responseTemplate = {
        ...responseTemplate,
        message: getMessageByLanguage(template, language as "en" | "ro" | "ru"),
      } as typeof template & { message: string };
    }

    return createApiResponse(responseTemplate);
  } catch (error) {
    console.error("Error fetching template:", error);
    return createErrorResponse("Internal server error");
  }
}

async function getTemplatesByCategory(category: string, searchParams: URLSearchParams) {
  try {
    const language = searchParams.get("language");

    const templates = await db.query.claxonTemplates.findMany({
      where: eq(claxonTemplates.category, category),
      orderBy: (claxonTemplates, { asc }) => [asc(claxonTemplates.id)],
    });

    let responseTemplates = templates;

    // Add language-specific messages if requested
    if (language) {
      responseTemplates = templates.map((template) => ({
        ...template,
        message: getMessageByLanguage(template, language as "en" | "ro" | "ru"),
      }));
    }

    return createApiResponse(responseTemplates);
  } catch (error) {
    console.error("Error fetching templates by category:", error);
    return createErrorResponse("Internal server error");
  }
}

// Helper function to get message by language
function getMessageByLanguage(template: typeof claxonTemplates.$inferSelect, language: "en" | "ro" | "ru"): string {
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
