import type { FastifyReply, FastifyRequest } from "fastify";
import type { AnyZodObject } from "zod";
import { asyncHandler } from "./errors";
import { ResponseHelper } from "./responses";

export interface RouteHandlerOptions {
	requireAuth?: boolean;
	validation?: {
		body?: AnyZodObject;
		params?: AnyZodObject;
		query?: AnyZodObject;
	};
}

export function createRouteHandler(
	handler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>,
	_options: RouteHandlerOptions = {},
) {
	return asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
		// Validation is handled by preHandler middleware
		// Auth is handled by preHandler middleware
		await handler(request, reply);
	});
}

export function successResponse<T>(
	reply: FastifyReply,
	data: T,
	message?: string,
	statusCode: number = 200,
) {
	if (statusCode === 201) {
		ResponseHelper.created(reply, data, message);
	} else if (statusCode === 204) {
		ResponseHelper.noContent(reply);
	} else {
		ResponseHelper.success(reply, data, message, statusCode);
	}
}
