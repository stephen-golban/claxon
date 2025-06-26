import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { claxonTemplatesService, type QueryClaxonTemplate } from "../services/claxon-templates.service";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware";
import { validateBody, validateParams, validateQuery } from "../utils/validation";
import { ResponseHelper } from "../utils/responses";
import { insertClaxonTemplateSchema, updateClaxonTemplateSchema } from "../db/schema";

// Validation schemas
const createTemplateBodySchema = insertClaxonTemplateSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

const updateTemplateBodySchema = updateClaxonTemplateSchema;

const templateIdParamsSchema = z.object({
	id: z.string(),
});

const categoryParamsSchema = z.object({
	category: z.string(),
});

const templateQuerySchema = z.object({
	category: z.string().optional(),
	language: z.enum(["en", "ro", "ru"]).optional(),
});

export async function claxonTemplatesRoutes(fastify: FastifyInstance) {
	// POST /claxon-templates - Create template (admin)
	fastify.post(
		"/claxon-templates",
		{
			preHandler: [requireAuth, validateBody(createTemplateBodySchema)],
		},
		async (request, reply) => {
			try {
				const dto = request.body as any;

				const template = await claxonTemplatesService.create(dto);
				ResponseHelper.created(reply, template, "Template created successfully");
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error) {
					ResponseHelper.error(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to create template");
				}
			}
		},
	);

	// GET /claxon-templates - Get all templates (public)
	fastify.get(
		"/claxon-templates",
		{
			preHandler: [optionalAuth, validateQuery(templateQuerySchema)],
		},
		async (request, reply) => {
			try {
				const queryDto = request.query as QueryClaxonTemplate;

				const templates = await claxonTemplatesService.findAll(queryDto);
				ResponseHelper.success(reply, templates);
			} catch (error) {
				fastify.log.error(error);
				ResponseHelper.error(reply, "Failed to retrieve templates");
			}
		},
	);

	// GET /claxon-templates/category/:category - Get templates by category (public)
	fastify.get(
		"/claxon-templates/category/:category",
		{
			preHandler: [
				optionalAuth,
				validateParams(categoryParamsSchema),
				validateQuery(templateQuerySchema),
			],
		},
		async (request, reply) => {
			try {
				const { category } = request.params as { category: string };
				const queryDto = request.query as QueryClaxonTemplate;

				const templates = await claxonTemplatesService.findByCategory(category, queryDto);
				ResponseHelper.success(reply, templates);
			} catch (error) {
				fastify.log.error(error);
				ResponseHelper.error(reply, "Failed to retrieve templates by category");
			}
		},
	);

	// GET /claxon-templates/:id - Get specific template (public)
	fastify.get(
		"/claxon-templates/:id",
		{
			preHandler: [
				optionalAuth,
				validateParams(templateIdParamsSchema),
				validateQuery(templateQuerySchema),
			],
		},
		async (request, reply) => {
			try {
				const { id } = request.params as { id: string };
				const queryDto = request.query as QueryClaxonTemplate;

				const template = await claxonTemplatesService.findOne(id, queryDto);
				ResponseHelper.success(reply, template);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message === "Template not found") {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to retrieve template");
				}
			}
		},
	);

	// PATCH /claxon-templates/:id - Update template (admin)
	fastify.patch(
		"/claxon-templates/:id",
		{
			preHandler: [
				requireAuth,
				validateParams(templateIdParamsSchema),
				validateBody(updateTemplateBodySchema),
			],
		},
		async (request, reply) => {
			try {
				const { id } = request.params as { id: string };
				const dto = request.body as any;

				const template = await claxonTemplatesService.update(id, dto);
				ResponseHelper.success(reply, template, "Template updated successfully");
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message === "Template not found") {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to update template");
				}
			}
		},
	);

	// DELETE /claxon-templates/:id - Delete template (admin)
	fastify.delete(
		"/claxon-templates/:id",
		{
			preHandler: [requireAuth, validateParams(templateIdParamsSchema)],
		},
		async (request, reply) => {
			try {
				const { id } = request.params as { id: string };

				await claxonTemplatesService.remove(id);
				ResponseHelper.noContent(reply);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message === "Template not found") {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to delete template");
				}
			}
		},
	);
}