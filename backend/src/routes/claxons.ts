import type { FastifyInstance } from "fastify";
import { type AnyZodObject, z } from "zod";
import {
	insertClaxonSchema,
	type NewClaxon,
	type UpdateClaxon,
	updateClaxonSchema,
} from "../db/schema";
import { getCurrentUserId, requireAuth } from "../middleware/auth.middleware";
import {
	claxonsService,
	type PaginationDto,
	type QueryClaxon,
} from "../services/claxons.service";
import { ResponseHelper } from "../utils/responses";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "../utils/validation";

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
			preHandler: [
				requireAuth,
				validateBody(createClaxonBodySchema as unknown as AnyZodObject),
			],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const createClaxonDto = request.body as unknown as NewClaxon;

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
				const paginationDto = request.query as PaginationDto &
					Partial<QueryClaxon>;

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
				const paginationDto = request.query as PaginationDto &
					Partial<QueryClaxon>;

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
				validateBody(updateClaxonBodySchema as unknown as AnyZodObject),
			],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const { id } = request.params as { id: string };
				const updateClaxonDto = request.body as unknown as UpdateClaxon;

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
