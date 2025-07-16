import { VEHICLE_COLORS } from "@/lib/constants";
import { translate } from "@/lib/utils";
import type { ColorNavigationDirection, VehicleColor, VehicleColorCode } from "./types";

/**
 * Get the appropriate color for the car icon, handling special cases
 */
export const getCarColor = (color: VehicleColor | undefined): string => {
  if (!color) return "#6B7280"; // Default gray

  // For special colors without rgba, use representative colors
  switch (color.code) {
    case "CAM": // Camouflage - use middle green
      return "#6B7C32";
    case "MUL": // Multicolored - use a vibrant blue
      return "#45B7D1";
    default:
      return color.rgba || "#6B7280";
  }
};

/**
 * Get gradient colors for special color codes
 */
export const getGradientColors = (colorCode: string): string[] | null => {
  switch (colorCode) {
    case "CAM": // Camouflage
      return ["#4A5D23", "#7C8B3A", "#B2C248", "#A3B18A"];
    case "MUL": // Multicolored
      return ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
    default:
      return null;
  }
};

/**
 * Get translated color name with fallback to description
 */
export const getColorName = (colorCode: string, fallbackDescription?: string): string => {
  return translate(`options:color:${colorCode as VehicleColorCode}`) || fallbackDescription || colorCode;
};

/**
 * Navigate to the next/previous color in the list
 */
export const navigateToNextColor = (
  currentValue: string,
  direction: ColorNavigationDirection,
  colors: readonly VehicleColor[] = VEHICLE_COLORS,
): VehicleColor | null => {
  const currentIndex = colors.findIndex((color) => color.code === currentValue);
  let newIndex: number;

  if (direction === "left") {
    newIndex = currentIndex > 0 ? currentIndex - 1 : colors.length - 1;
  } else {
    newIndex = currentIndex < colors.length - 1 ? currentIndex + 1 : 0;
  }

  return colors[newIndex] || null;
};

/**
 * Find a color by its code
 */
export const findColorByCode = (
  colorCode: string,
  colors: readonly VehicleColor[] = VEHICLE_COLORS,
): VehicleColor | undefined => {
  return colors.find((color) => color.code === colorCode);
};

/**
 * Check if a color has a gradient pattern
 */
export const hasGradientPattern = (colorCode: string): boolean => {
  return getGradientColors(colorCode) !== null;
};

/**
 * Check if a color has an rgba value
 */
export const hasRgbaValue = (color: VehicleColor): boolean => {
  return color.rgba !== null;
};
