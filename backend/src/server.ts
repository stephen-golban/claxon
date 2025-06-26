import "dotenv/config";
import env from "@fastify/env";
import Fastify from "fastify";
import { clerkClient, clerkPlugin, getAuth } from "@clerk/fastify";
import { type Level, createLogger } from "./utils/logger";

const schema = {
	type: "object",
	required: [
		"PORT",
		"DATABASE_URL",
		"CLERK_PUBLISHABLE_KEY",
		"CLERK_SECRET_KEY",
		"UPLOADTHING_SECRET",
	],
	properties: {
		PORT: {
			type: "string",
			default: 3000,
		},
		DATABASE_URL: {
			type: "string",
		},
		CLERK_PUBLISHABLE_KEY: {
			type: "string",
		},
		CLERK_SECRET_KEY: {
			type: "string",
		},
		UPLOADTHING_SECRET: {
			type: "string",
		},
		PINO_LOG_LEVEL: {
			type: "string",
			default: "error",
		},
		NODE_ENV: {
			type: "string",
			default: "production",
		},
	},
};

const options = {
	schema: schema,
	dotenv: true,
};

declare module "fastify" {
	interface FastifyInstance {
		config: {
			PORT: string;
			DATABASE_URL: string;
			CLERK_PUBLISHABLE_KEY: string;
			CLERK_SECRET_KEY: string;
			UPLOADTHING_SECRET: string;
			PINO_LOG_LEVEL: string;
			NODE_ENV: string;
		};
	}
}


const level = process.env.PINO_LOG_LEVEL as Level;
const isDev = process.env.NODE_ENV === "development";
const logger = createLogger({ level, isDev });

export { logger };

export const createServer = async () => {
	const fastify = Fastify({
		logger: true,
	});

	await fastify.register(env, options).after();

	// Register Clerk plugin
	await fastify.register(clerkPlugin);

	fastify.get("/ping", (request, reply) => {
		reply.send({ message: "pong" });
	});

	// Protected route example
	fastify.get("/protected", async (request, reply) => {
		try {
			const { userId } = getAuth(request);

			if (!userId) {
				return reply.code(401).send({ error: "User not authenticated" });
			}

			const user = await clerkClient.users.getUser(userId);

			return reply.send({
				message: "User retrieved successfully",
				user,
			});
		} catch (error) {
			fastify.log.error(error);
			return reply.code(500).send({ error: "Failed to retrieve user" });
		}
	});

	// Get current user info
	fastify.get("/me", async (request, reply) => {
		try {
			const { userId, sessionId } = getAuth(request);

			if (!userId) {
				return reply.code(401).send({ error: "User not authenticated" });
			}

			return reply.send({
				userId,
				sessionId,
			});
		} catch (error) {
			fastify.log.error(error);
			return reply.code(500).send({ error: "Failed to get user info" });
		}
	});

	return fastify;
};
