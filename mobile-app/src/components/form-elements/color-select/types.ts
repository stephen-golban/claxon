import type { VEHICLE_COLORS } from "@/lib/constants";

/**
 * Type representing a vehicle color from the config
 */
export type VehicleColor = (typeof VEHICLE_COLORS)[number];
/**
 * Type representing a selected color from the color palette
 */
export type SelectedColor = (typeof VEHICLE_COLORS)[number];
