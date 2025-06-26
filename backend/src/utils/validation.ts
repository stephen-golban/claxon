import type { FastifyReply, FastifyRequest } from "fastify";
import type { AnyZodObject, ZodError } from "zod";
import { ResponseHelper } from "./responses";

export interface ValidationOptions {
	body?: AnyZodObject;
	params?: AnyZodObject;
	query?: AnyZodObject;
}

export function validateRequest(options: ValidationOptions) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			// Validate body
			if (options.body && request.body) {
				request.body = options.body.parse(request.body);
			}

			// Validate params
			if (options.params && request.params) {
				request.params = options.params.parse(request.params);
			}

			// Validate query
			if (options.query && request.query) {
				request.query = options.query.parse(request.query);
			}
		} catch (error) {
			if (error instanceof Error) {
				const zodError = error as ZodError;
				if (zodError.issues) {
					const validationErrors = zodError.issues.map(
						(issue) => `${issue.path.join(".")}: ${issue.message}`,
					);
					return ResponseHelper.badRequest(
						reply,
						`Validation failed: ${validationErrors.join(", ")}`,
					);
				}
			}
			return ResponseHelper.badRequest(reply, "Invalid request data");
		}
	};
}

export function validateBody<_T>(schema: AnyZodObject) {
	return validateRequest({ body: schema });
}

export function validateParams<_T>(schema: AnyZodObject) {
	return validateRequest({ params: schema });
}

export function validateQuery<_T>(schema: AnyZodObject) {
	return validateRequest({ query: schema });
}
