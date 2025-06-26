import type { FastifyInstance } from "fastify";
import { getCurrentUser, requireAuth } from "../middleware/auth.middleware";
import { createRouteHandler, successResponse } from "../utils/route-handler";

export async function healthRoutes(fastify: FastifyInstance) {
	// GET /health - System health check
	fastify.get("/health", (_request, reply) => {
		reply.send({
			status: "ok",
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV || "development",
		});
	});

	// GET /protected - Protected endpoint example (for testing auth)
	fastify.get(
		"/protected",
		{
			preHandler: [requireAuth],
		},
		createRouteHandler(async (request, reply) => {
			const user = await getCurrentUser(request);
			successResponse(reply, {
				message: "User retrieved successfully",
				user: {
					id: user.id,
					emailAddresses: user.emailAddresses,
					firstName: user.firstName,
					lastName: user.lastName,
				},
			});
		}),
	);
}
