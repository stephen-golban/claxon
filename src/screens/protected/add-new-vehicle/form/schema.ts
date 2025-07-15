import { z } from "zod";
import { stringifyObjectValidate } from "@/lib/utils";
import type { Vehicle } from "@/services/api/vehicles";

// Vehicle form validation schema
export const addVehicleSchema = z.object({
  brand: z.string().min(1, stringifyObjectValidate({ keyT: "errors:required" })),
  model: z.string().min(1, stringifyObjectValidate({ keyT: "errors:required" })),
  manufacture_year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  color: z.string().min(1, stringifyObjectValidate({ keyT: "errors:required" })),
  vin_code: z
    .string()
    .min(17, "VIN code must be 17 characters")
    .max(17, "VIN code must be 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN code contains invalid characters"),
});

export type AddVehicleFormData = z.infer<typeof addVehicleSchema>;

export const defaultValues: AddVehicleFormData = {
  brand: "",
  model: "",
  manufacture_year: new Date().getFullYear(),
  color: "",
  vin_code: "",
};

/**
 * Transforms a vehicle record to form data format
 * @param vehicle - The vehicle record from the database
 * @returns Form data object
 */
export const transformVehicleToFormData = (vehicle?: Vehicle | null): AddVehicleFormData => {
  if (!vehicle) {
    return defaultValues;
  }

  return {
    brand: vehicle.brand || "",
    model: vehicle.model || "",
    manufacture_year: vehicle.manufacture_year || new Date().getFullYear(),
    color: vehicle.color || "",
    vin_code: vehicle.vin_code || "",
  };
};
