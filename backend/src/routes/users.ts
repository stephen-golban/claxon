import type { FastifyInstance } from "fastify";
import { type AnyZodObject, z } from "zod";
import {
	insertUserSchema,
	type NewUser,
	type UpdateUser,
	updateUserSchema,
} from "../db/schema";
import {
	type AuthenticatedRequest,
	getCurrentUserId,
	requireAuth,
} from "../middleware/auth.middleware";
import { usersService } from "../services/users.service";
import { createRouteHandler, successResponse } from "../utils/route-handler";
import { validateBody, validateParams } from "../utils/validation";

// Validation schemas
const createUserBodySchema = insertUserSchema.omit({
	id: true,
	clerkId: true,
	createdAt: true,
	updatedAt: true,
});

const updateUserBodySchema = updateUserSchema;

const clerkIdParamsSchema = z.object({
	clerkId: z.string(),
});

export async function usersRoutes(fastify: FastifyInstance) {
	// GET /users/me - Get current user auth info (lightweight)
	fastify.get(
		"/users/me",
		{
			preHandler: [requireAuth],
		},
		createRouteHandler(async (request, reply) => {
			const userId = getCurrentUserId(request);
			const authRequest = request as unknown as AuthenticatedRequest;
			successResponse(reply, {
				userId,
				sessionId: authRequest.sessionId,
			});
		}),
	);

	// POST /users - Create user profile
	fastify.post(
		"/users",
		{
			preHandler: [
				requireAuth,
				validateBody(createUserBodySchema as unknown as AnyZodObject),
			],
		},
		createRouteHandler(async (request, reply) => {
			const userId = getCurrentUserId(request);
			const createUserDto = request.body as unknown as NewUser;

			const user = await usersService.create(createUserDto, userId);
			successResponse(reply, user, "User created successfully", 201);
		}),
	);

	// GET /users/current - Get current user profile
	fastify.get(
		"/users/current",
		{
			preHandler: [requireAuth],
		},
		createRouteHandler(async (request, reply) => {
			const userId = getCurrentUserId(request);
			const user = await usersService.findByClerkId(userId);
			successResponse(reply, user);
		}),
	);

	// GET /users/by-clerk-id/:clerkId - Get user by Clerk ID
	fastify.get(
		"/users/by-clerk-id/:clerkId",
		{
			preHandler: [requireAuth, validateParams(clerkIdParamsSchema)],
		},
		createRouteHandler(async (request, reply) => {
			const { clerkId } = request.params as { clerkId: string };
			const user = await usersService.findByClerkId(clerkId);
			successResponse(reply, user);
		}),
	);

	// PATCH /users - Update user profile
	fastify.patch(
		"/users",
		{
			preHandler: [
				requireAuth,
				validateBody(updateUserBodySchema as unknown as AnyZodObject),
			],
		},
		createRouteHandler(async (request, reply) => {
			const userId = getCurrentUserId(request);
			const updateUserDto = request.body as unknown as UpdateUser;

			const user = await usersService.update(userId, updateUserDto);
			successResponse(reply, user, "User updated successfully");
		}),
	);

	// DELETE /users - Delete user account
	fastify.delete(
		"/users",
		{
			preHandler: [requireAuth],
		},
		createRouteHandler(async (request, reply) => {
			const userId = getCurrentUserId(request);
			await usersService.remove(userId);
			successResponse(reply, null, undefined, 204);
		}),
	);
}
