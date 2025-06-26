import "dotenv/config";
import { clerkPlugin } from "@clerk/fastify";
import cors from "@fastify/cors";
import env from "@fastify/env";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { claxonTemplatesRoutes } from "./routes/claxon-templates";
import { claxonsRoutes } from "./routes/claxons";
import { healthRoutes } from "./routes/health";
import { usersRoutes } from "./routes/users";
import { vehiclesRoutes } from "./routes/vehicles";
import { errorHandler } from "./utils/errors";
import { createLogger, type Level } from "./utils/logger";

const schema = {
	type: "object",
	required: [
		"PORT",
		"DATABASE_URL",
		"CLERK_PUBLISHABLE_KEY",
		"CLERK_SECRET_KEY",
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

	// Register global error handler
	fastify.setErrorHandler(errorHandler);

	await fastify.register(env, options).after();

	// Register security plugins
	await fastify.register(helmet, {
		contentSecurityPolicy: false, // Disable CSP for API
	});

	await fastify.register(cors, {
		origin: (origin, callback) => {
			// Allow requests with no origin (mobile apps, curl, etc.)
			if (!origin) return callback(null, true);

			// In production, you'd want to validate allowed origins
			const _allowedOrigins = [
				"http://localhost:3000",
				"http://localhost:8081", // Expo dev server
				"exp://localhost:8081", // Expo dev server
			];

			if (process.env.NODE_ENV === "production") {
				// Add your production domains here
				// allowedOrigins.push("https://yourdomain.com");
			}

			return callback(null, true); // Allow all origins for now
		},
		credentials: true,
	});

	// Register multipart plugin for file uploads
	await fastify.register(multipart);

	// Register Clerk plugin
	await fastify.register(clerkPlugin);

	// Register route handlers
	await fastify.register(healthRoutes);
	await fastify.register(usersRoutes);
	await fastify.register(vehiclesRoutes);
	await fastify.register(claxonTemplatesRoutes);
	await fastify.register(claxonsRoutes);

	return fastify;
};
