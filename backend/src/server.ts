import "dotenv/config";
import env from "@fastify/env";
import multipart from "@fastify/multipart";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import { type Level, createLogger } from "./utils/logger";
import { errorHandler } from "./utils/errors";
import { healthRoutes } from "./routes/health";
import { usersRoutes } from "./routes/users";
import { vehiclesRoutes } from "./routes/vehicles";
import { claxonTemplatesRoutes } from "./routes/claxon-templates";
import { claxonsRoutes } from "./routes/claxons";
import { createRouteHandler } from "uploadthing/fastify";
import { uploadRouter } from "./routes/uploadthing";

const schema = {
	type: "object",
	required: [
		"PORT",
		"DATABASE_URL",
		"CLERK_PUBLISHABLE_KEY",
		"CLERK_SECRET_KEY",
		"UPLOADTHING_TOKEN",
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
		UPLOADTHING_TOKEN: {
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
			UPLOADTHING_TOKEN: string;
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
			const allowedOrigins = [
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

	// Register UploadThing routes (must be before other routes to avoid conflicts)
	await fastify.register(createRouteHandler, {
		router: uploadRouter,
	});

	// Register route handlers
	await fastify.register(healthRoutes);
	await fastify.register(usersRoutes);
	await fastify.register(vehiclesRoutes);
	await fastify.register(claxonTemplatesRoutes);
	await fastify.register(claxonsRoutes);

	return fastify;
};
