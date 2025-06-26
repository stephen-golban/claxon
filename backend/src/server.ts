import env from "@fastify/env";
import dotenv from "dotenv";
import Fastify from "fastify";
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

dotenv.config();

const level = process.env.PINO_LOG_LEVEL as Level;
const isDev = process.env.NODE_ENV === "development";
const logger = createLogger({ level, isDev });

export { logger };

export const createServer = async () => {
	const fastify = Fastify({
		logger: true,
	});

	await fastify.register(env, options).after();

	fastify.get("/ping", (request, reply) => {
		reply.send({ message: "pong" });
	});

	return fastify;
};
