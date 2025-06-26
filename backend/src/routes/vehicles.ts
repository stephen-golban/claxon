import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { vehiclesService } from "../services/vehicles.service";
import { requireAuth, optionalAuth, getCurrentUserId } from "../middleware/auth.middleware";
import { validateBody, validateParams, validateQuery } from "../utils/validation";
import { ResponseHelper } from "../utils/responses";
import { insertVehicleSchema, updateVehicleSchema } from "../db/schema";

// Validation schemas
const createVehicleBodySchema = insertVehicleSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

const updateVehicleBodySchema = updateVehicleSchema;

const vehicleIdParamsSchema = z.object({
	id: z.string(),
});

const plateNumberParamsSchema = z.object({
	plateNumber: z.string(),
});

const vehicleQuerySchema = z.object({
	brand: z.string().optional(),
	model: z.string().optional(),
	color: z.string().optional(),
	plateType: z.string().optional(),
	plateCountry: z.string().optional(),
	isActive: z.coerce.boolean().optional(),
});

export async function vehiclesRoutes(fastify: FastifyInstance) {
	// POST /vehicles - Create/register new vehicle
	fastify.post(
		"/vehicles",
		{
			preHandler: [requireAuth, validateBody(createVehicleBodySchema)],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const createVehicleDto = request.body as any;

				const vehicle = await vehiclesService.create(createVehicleDto, userId);
				ResponseHelper.created(reply, vehicle, "Vehicle created successfully");
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error) {
					ResponseHelper.error(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to create vehicle");
				}
			}
		},
	);

	// GET /vehicles - Get user's vehicles with filtering
	fastify.get(
		"/vehicles",
		{
			preHandler: [requireAuth, validateQuery(vehicleQuerySchema)],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const queryDto = request.query as any;

				const vehicles = await vehiclesService.findAllByUser(userId, queryDto);
				ResponseHelper.success(reply, vehicles);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message === "User not found") {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to retrieve vehicles");
				}
			}
		},
	);

	// GET /vehicles/search/:plateNumber - Search vehicle by plate (public)
	fastify.get(
		"/vehicles/search/:plateNumber",
		{
			preHandler: [optionalAuth, validateParams(plateNumberParamsSchema)],
		},
		async (request, reply) => {
			try {
				const { plateNumber } = request.params as { plateNumber: string };

				const vehicle = await vehiclesService.searchByPlate(plateNumber);
				ResponseHelper.success(reply, vehicle);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message === "Vehicle not found or not active") {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to search vehicle");
				}
			}
		},
	);

	// GET /vehicles/:id - Get specific vehicle
	fastify.get(
		"/vehicles/:id",
		{
			preHandler: [requireAuth, validateParams(vehicleIdParamsSchema)],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const { id } = request.params as { id: string };

				const vehicle = await vehiclesService.findOne(id, userId);
				ResponseHelper.success(reply, vehicle);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message.includes("not found")) {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to retrieve vehicle");
				}
			}
		},
	);

	// PATCH /vehicles/:id - Update vehicle
	fastify.patch(
		"/vehicles/:id",
		{
			preHandler: [
				requireAuth,
				validateParams(vehicleIdParamsSchema),
				validateBody(updateVehicleBodySchema),
			],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const { id } = request.params as { id: string };
				const updateVehicleDto = request.body as any;

				const vehicle = await vehiclesService.update(id, updateVehicleDto, userId);
				ResponseHelper.success(reply, vehicle, "Vehicle updated successfully");
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message.includes("not found")) {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to update vehicle");
				}
			}
		},
	);

	// DELETE /vehicles/:id - Delete vehicle
	fastify.delete(
		"/vehicles/:id",
		{
			preHandler: [requireAuth, validateParams(vehicleIdParamsSchema)],
		},
		async (request, reply) => {
			try {
				const userId = getCurrentUserId(request);
				const { id } = request.params as { id: string };

				await vehiclesService.remove(id, userId);
				ResponseHelper.noContent(reply);
			} catch (error) {
				fastify.log.error(error);
				if (error instanceof Error && error.message.includes("not found")) {
					ResponseHelper.notFound(reply, error.message);
				} else {
					ResponseHelper.error(reply, "Failed to delete vehicle");
				}
			}
		},
	);
}