import type { FastifyRequest } from "fastify";
import { getAuth } from "@clerk/fastify";

export const requireAuth = (request: FastifyRequest) => {
	const { userId } = getAuth(request);
	
	if (!userId) {
		throw new Error("Authentication required");
	}
	
	return { userId };
};

export const getAuthUserId = (request: FastifyRequest): string | null => {
	const { userId } = getAuth(request);
	return userId || null;
};

export const isAuthenticated = (request: FastifyRequest): boolean => {
	const { userId } = getAuth(request);
	return !!userId;
};