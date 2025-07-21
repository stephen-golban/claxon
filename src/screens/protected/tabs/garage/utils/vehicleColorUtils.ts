import { VEHICLE_COLORS } from "@/lib/constants";

/**
 * Vehicle color utility functions following Single Responsibility Principle
 * Handles all color-related logic for vehicle display
 */

export interface VehicleColorInfo {
  code: string;
  description: string;
  rgba?: string | null;
}

/**
 * Gets vehicle color information by color code
 */
export const getVehicleColor = (colorCode: string | null): VehicleColorInfo | null => {
  if (!colorCode) return null;
  return VEHICLE_COLORS.find((color) => color.code === colorCode) || null;
};

/**
 * Gets gradient colors for special vehicle color codes
 */
export const getGradientColors = (colorCode: string): string[] | null => {
  switch (colorCode) {
    case "CAM":
      return ["#4A5D23", "#7C8B3A", "#B2C248", "#A3B18A"];
    case "MUL":
      return ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
    default:
      return null;
  }
};

/**
 * Gets the appropriate car icon color based on vehicle color with proper contrast
 * Ensures visibility in both light and dark themes
 */
export const getCarColor = (color: VehicleColorInfo | null, isDarkTheme?: boolean): string => {
  if (!color) return isDarkTheme ? "#9CA3AF" : "#6B7280";

  // For special colors, use theme-appropriate variants
  switch (color.code) {
    case "CAM":
      return isDarkTheme ? "#8FA653" : "#6B7C32"; // Lighter green for dark theme
    case "MUL":
      return "#45B7D1"; // Blue works well in both themes
    case "BLK": // Black
      return isDarkTheme ? "#D1D5DB" : "#374151"; // Light gray in dark theme, dark gray in light theme
    case "WHI": // White
      return isDarkTheme ? "#F3F4F6" : "#6B7280"; // Off-white in dark theme, gray in light theme
    case "SIL": // Silver
      return isDarkTheme ? "#E5E7EB" : "#9CA3AF"; // Lighter silver in dark theme
    case "GRA": // Gray
      return isDarkTheme ? "#D1D5DB" : "#6B7280"; // Lighter gray in dark theme
    default: {
      // For other colors, check if they're too dark/light and adjust
      const originalColor = color.rgba || "#6B7280";
      return getContrastAdjustedColor(originalColor, isDarkTheme);
    }
  }
};

/**
 * Adjusts color for better contrast based on theme
 */
const getContrastAdjustedColor = (color: string, isDarkTheme?: boolean): string => {
  // Convert hex to RGB to check brightness
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (isDarkTheme) {
    // In dark theme, if color is too dark, lighten it
    if (luminance < 0.3) {
      return lightenColor(color, 0.4);
    }
  } else {
    // In light theme, if color is too light, darken it
    if (luminance > 0.8) {
      return darkenColor(color, 0.3);
    }
  }

  return color;
};

/**
 * Lightens a hex color by a given amount
 */
const lightenColor = (color: string, amount: number): string => {
  const hex = color.replace("#", "");
  const r = Math.min(255, Math.floor(parseInt(hex.slice(0, 2), 16) * (1 + amount)));
  const g = Math.min(255, Math.floor(parseInt(hex.slice(2, 4), 16) * (1 + amount)));
  const b = Math.min(255, Math.floor(parseInt(hex.slice(4, 6), 16) * (1 + amount)));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

/**
 * Darkens a hex color by a given amount
 */
const darkenColor = (color: string, amount: number): string => {
  const hex = color.replace("#", "");
  const r = Math.max(0, Math.floor(parseInt(hex.slice(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(parseInt(hex.slice(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.floor(parseInt(hex.slice(4, 6), 16) * (1 - amount)));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

/**
 * Determines if a vehicle color has special gradient treatment
 */
export const hasGradientColors = (colorCode: string): boolean => {
  return ["CAM", "MUL"].includes(colorCode);
};

/**
 * Gets all color-related information for a vehicle in one call
 */
export const getVehicleColorInfo = (colorCode: string | null, isDarkTheme?: boolean) => {
  const color = getVehicleColor(colorCode);
  const gradientColors = colorCode ? getGradientColors(colorCode) : null;
  const carColor = getCarColor(color, isDarkTheme);
  const hasGradient = colorCode ? hasGradientColors(colorCode) : false;

  return {
    color,
    gradientColors,
    carColor,
    hasGradient,
  };
};
