import type { FastifyReply } from "fastify";

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
	pagination?: {
		total: number;
		limit: number;
		offset: number;
	};
}

export const ResponseHelper = {
	success<T>(
		reply: FastifyReply,
		data: T,
		message?: string,
		statusCode = 200,
	): void {
		reply.code(statusCode).send({
			success: true,
			data,
			message,
		} as ApiResponse<T>);
	},

	created<T>(reply: FastifyReply, data: T, message?: string): void {
		reply.code(201).send({
			success: true,
			data,
			message,
		} as ApiResponse<T>);
	},

	noContent(reply: FastifyReply): void {
		reply.code(204).send();
	},

	error(reply: FastifyReply, error: string, statusCode = 500): void {
		reply.code(statusCode).send({
			success: false,
			error,
		} as ApiResponse);
	},

	badRequest(reply: FastifyReply, error: string): void {
		ResponseHelper.error(reply, error, 400);
	},

	unauthorized(reply: FastifyReply, error = "Unauthorized"): void {
		ResponseHelper.error(reply, error, 401);
	},

	forbidden(reply: FastifyReply, error = "Forbidden"): void {
		ResponseHelper.error(reply, error, 403);
	},

	notFound(reply: FastifyReply, error = "Not found"): void {
		ResponseHelper.error(reply, error, 404);
	},

	conflict(reply: FastifyReply, error: string): void {
		ResponseHelper.error(reply, error, 409);
	},

	paginated<T>(
		reply: FastifyReply,
		data: T[],
		total: number,
		limit: number,
		offset: number,
		message?: string,
	): void {
		reply.code(200).send({
			success: true,
			data,
			message,
			pagination: {
				total,
				limit,
				offset,
			},
		} as PaginatedResponse<T[]>);
	},
};
