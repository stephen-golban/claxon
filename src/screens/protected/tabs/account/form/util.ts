import type { AccountFormData } from "./schema";

/**
 * Compares two AccountFormData objects to detect changes
 * @param original - The original form data values
 * @param current - The current form data values
 * @returns true if any field has changed, false otherwise
 */
export const hasFormDataChanged = (original: AccountFormData, current: AccountFormData): boolean => {
  return original.is_phone_public !== current.is_phone_public;
};

/**
 * Validates if the account form data is ready for submission
 * @param data - The form data to validate
 * @returns true if the data is valid for submission
 */
export const isAccountFormDataValid = (data: AccountFormData): boolean => {
  return typeof data.is_phone_public === "boolean";
};

/**
 * Creates a summary of changes between original and current form data
 * @param original - The original form data values
 * @param current - The current form data values
 * @returns An object describing what fields have changed
 */
export const getFormDataChanges = (original: AccountFormData, current: AccountFormData) => {
  const changes: Record<string, { from: boolean; to: boolean }> = {};

  if (original.is_phone_public !== current.is_phone_public) {
    changes.is_phone_public = {
      from: original.is_phone_public,
      to: current.is_phone_public,
    };
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
  original: AccountFormData,
  current: AccountFormData,
  fieldName: keyof AccountFormData,
): boolean => {
  return original[fieldName] !== current[fieldName];
};
