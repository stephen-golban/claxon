import type { VehicleFormData } from "./schema";

/**
 * Compares two AddVehicleFormData objects to detect changes
 * @param original - The original form data values
 * @param current - The current form data values
 * @returns true if any field has changed, false otherwise
 */
export const hasFormDataChanged = (original: VehicleFormData, current: VehicleFormData): boolean => {
  const fieldsToCompare: (keyof VehicleFormData)[] = ["brand", "model", "manufacture_year", "color", "vin_code"];

  for (const field of fieldsToCompare) {
    if (original[field] !== current[field]) {
      return true;
    }
  }

  return false;
};

/**
 * Validates if the vehicle form data is ready for submission
 * @param data - The form data to validate
 * @returns true if the data is valid for submission
 */
export const isVehicleFormDataValid = (data: VehicleFormData): boolean => {
  return !!(
    data.brand &&
    data.model &&
    data.manufacture_year &&
    data.color &&
    data.vin_code &&
    data.vin_code.length === 17
  );
};

/**
 * Creates a summary of changes between original and current form data
 * @param original - The original form data values
 * @param current - The current form data values
 * @returns An object describing what fields have changed
 */
export const getFormDataChanges = (original: VehicleFormData, current: VehicleFormData) => {
  const changes: Record<string, { from: string | number; to: string | number }> = {};

  const fieldsToCompare: (keyof VehicleFormData)[] = ["brand", "model", "manufacture_year", "color", "vin_code"];

  for (const field of fieldsToCompare) {
    if (original[field] !== current[field]) {
      changes[field as keyof typeof changes] = {
        from: original[field],
        to: current[field],
      };
    }
  }

  return changes;
};

/**
 * Checks if a specific field has changed between original and current data
 * @param original - The original form data values
 * @param current - The current form data values
 * @param fieldName - The name of the field to check
 * @returns true if the specified field has changed
 */
export const hasFieldChanged = (
  original: VehicleFormData,
  current: VehicleFormData,
  fieldName: keyof VehicleFormData,
): boolean => {
  return original[fieldName] !== current[fieldName];
};
