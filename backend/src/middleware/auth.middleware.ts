import type { User } from "@clerk/backend";
import { clerkClient, getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHelper } from "../utils/responses";

export interface AuthenticatedRequest extends FastifyRequest {
	user?: User;
	userId?: string;
	sessionId?: string;
}

export async function requireAuth(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	try {
		const { userId, sessionId } = getAuth(request);

		if (!userId) {
			return ResponseHelper.unauthorized(reply, "User not authenticated");
		}

		// Add auth info to request
		(request as AuthenticatedRequest).userId = userId;
		(request as AuthenticatedRequest).sessionId = sessionId;

		// Only fetch user data when specifically needed to reduce API calls
		// Individual routes can fetch user data using getCurrentUser() if needed
	} catch (error) {
		request.log.error("Auth middleware error:", error);
		return ResponseHelper.unauthorized(reply, "Authentication failed");
	}
}

export async function optionalAuth(
	request: FastifyRequest,
	_reply: FastifyReply,
): Promise<void> {
	try {
		const { userId, sessionId } = getAuth(request);

		if (userId) {
			(request as AuthenticatedRequest).userId = userId;
			(request as AuthenticatedRequest).sessionId = sessionId;

			try {
				const user = await clerkClient.users.getUser(userId);
				(request as AuthenticatedRequest).user = user;
			} catch (error) {
				console.warn("Failed to fetch user details:", error);
			}
		}
	} catch (error) {
		// Optional auth - don't fail on errors
		console.warn("Optional auth middleware error:", error);
	}
}

export function getCurrentUserId(request: FastifyRequest): string {
	const authRequest = request as AuthenticatedRequest;
	if (!authRequest.userId) {
		throw new Error("User not authenticated");
	}
	return authRequest.userId;
}

export async function getCurrentUser(request: FastifyRequest): Promise<User> {
	const authRequest = request as AuthenticatedRequest;
	if (!authRequest.userId) {
		throw new Error("User not authenticated");
	}

	try {
		const user = await clerkClient.users.getUser(authRequest.userId);
		return user;
	} catch (error) {
		request.log.error("Failed to fetch user details:", error);
		throw new Error("Failed to retrieve user");
	}
}
