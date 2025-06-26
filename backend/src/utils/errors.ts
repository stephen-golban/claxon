import type { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHelper } from "./responses";

export class AppError extends Error {
	constructor(
		public override message: string,
		public statusCode: number = 500,
		public code?: string,
	) {
		super(message);
		this.name = "AppError";
	}
}

export class ValidationError extends AppError {
	constructor(message: string, _field?: string) {
		super(message, 400, "VALIDATION_ERROR");
		this.name = "ValidationError";
	}
}

export class AuthenticationError extends AppError {
	constructor(message: string = "Authentication required") {
		super(message, 401, "AUTHENTICATION_ERROR");
		this.name = "AuthenticationError";
	}
}

export class AuthorizationError extends AppError {
	constructor(message: string = "Insufficient permissions") {
		super(message, 403, "AUTHORIZATION_ERROR");
		this.name = "AuthorizationError";
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string = "Resource") {
		super(`${resource} not found`, 404, "NOT_FOUND_ERROR");
		this.name = "NotFoundError";
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409, "CONFLICT_ERROR");
		this.name = "ConflictError";
	}
}

export function errorHandler(
	error: Error,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	request.log.error(error);

	if (error instanceof AppError) {
		return ResponseHelper.error(reply, error.message, error.statusCode);
	}

	// Handle Clerk errors
	if (error.name === "ClerkAPIError") {
		return ResponseHelper.unauthorized(reply, "Authentication failed");
	}

	// Handle database constraint errors
	if (
		error.message.includes("duplicate key") ||
		error.message.includes("UNIQUE constraint")
	) {
		return ResponseHelper.conflict(reply, "Resource already exists");
	}

	// Generic server error
	return ResponseHelper.error(reply, "Internal server error", 500);
}

export function asyncHandler(
	fn: (request: FastifyRequest, reply: FastifyReply) => Promise<void>,
) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			await fn(request, reply);
		} catch (error) {
			errorHandler(error as Error, request, reply);
		}
	};
}
