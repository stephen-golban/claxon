import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { claxonsService, type QueryClaxon, type PaginationDto } from "../services/claxons.service";
import { requireAuth, getCurrentUserId } from "../middleware/auth.middleware";
import { validateBody, validateParams, validateQuery } from "../utils/validation";
import { ResponseHelper } from "../utils/responses";
import { insertClaxonSchema, updateClaxonSchema } from "../db/schema";

// Validation schemas
const createClaxonBodySchema = insertClaxonSchema.omit({
	id: true,
	senderId: true,
	createdAt: true,
	updatedAt: true,
});

const updateClaxonBodySchema = updateClaxonSchema;

const claxonIdParamsSchema = z.object({
	id: z.string(),
});

const paginationQuerySchema = z.object({
	limit: z.coerce.number().min(1).max(100).default(20),
	offset: z.coerce.number().min(0).default(0),
	read: z.string().optional(),
	type: z.string().optional(),
	senderLanguage: z.string().optional(),
});

export async function claxonsRoutes(fastify: FastifyInstance) {
	// POST /claxons - Create new claxon message
	fastify.post(
		"/claxons",
		{
			preHandler: [requireAuth, validateBody(createClaxonBodySchema)],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const createClaxonDto = request.body as any;

				const claxon = await claxonsService.create(createClaxonDto, userId);
				ResponseHelper.created(reply, claxon, "Claxon created successfully");
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error) {
					if (error.message.includes("not found")) {
						ResponseHelper.notFound(reply, error.message);
					} else {
						ResponseHelper.error(reply, error.message);
					}
				} else {
					ResponseHelper.error(reply, "Failed to create claxon");
				}
			}
		},
	);

	// GET /claxons/inbox - Get received messages with pagination
	fastify.get(
		"/claxons/inbox",
		{
			preHandler: [requireAuth, validateQuery(paginationQuerySchema)],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const paginationDto = request.query as PaginationDto & Partial<QueryClaxon>;

				const claxons = await claxonsService.findInbox(userId, paginationDto);
				ResponseHelper.success(reply, claxons);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message === "User not found") {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to retrieve inbox");
				}
			}
		},
	);

	// GET /claxons/inbox/unread-count - Get unread message count
	fastify.get(
		"/claxons/inbox/unread-count",
		{
			preHandler: [requireAuth],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);

				const result = await claxonsService.getUnreadCount(userId);
				ResponseHelper.success(reply, result);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message === "User not found") {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to get unread count");
				}
			}
		},
	);

	// GET /claxons/sent - Get sent messages with pagination
	fastify.get(
		"/claxons/sent",
		{
			preHandler: [requireAuth, validateQuery(paginationQuerySchema)],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const paginationDto = request.query as PaginationDto & Partial<QueryClaxon>;

				const claxons = await claxonsService.findSent(userId, paginationDto);
				ResponseHelper.success(reply, claxons);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message === "User not found") {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to retrieve sent messages");
				}
			}
		},
	);

	// GET /claxons/:id - Get specific claxon
	fastify.get(
		"/claxons/:id",
		{
			preHandler: [requireAuth, validateParams(claxonIdParamsSchema)],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const { id } = request.params as { id: string };

				const claxon = await claxonsService.findOne(id, userId);
				ResponseHelper.success(reply, claxon);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message.includes("not found")) {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to retrieve claxon");
				}
			}
		},
	);

	// PATCH /claxons/:id - Update claxon (mark as read)
	fastify.patch(
		"/claxons/:id",
		{
			preHandler: [
				requireAuth,
				validateParams(claxonIdParamsSchema),
				validateBody(updateClaxonBodySchema),
			],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const { id } = request.params as { id: string };
				const updateClaxonDto = request.body as any;

				const claxon = await claxonsService.update(id, updateClaxonDto, userId);
				ResponseHelper.success(reply, claxon, "Claxon updated successfully");
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message.includes("not found")) {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to update claxon");
				}
			}
		},
	);
}