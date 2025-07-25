import type { PersonalDetailsFormData } from "./schema";

/**
 * Compares two PersonalDetailsFormData objects to detect changes
 * Ignores the image field for change detection since it's handled separately
 * @param original - The original form data values
 * @param current - The current form data values
 * @returns true if any field has changed, false otherwise
 */
export const hasFormDataChanged = (original: PersonalDetailsFormData, current: PersonalDetailsFormData): boolean => {
  // Compare all fields except image
  const fieldsToCompare: (keyof Omit<PersonalDetailsFormData, "image">)[] = [
    "email",
    "first_name",
    "last_name",
    "gender",
  ];

  for (const field of fieldsToCompare) {
    if (original[field] !== current[field]) {
      return true;
    }
  }

  // Check if a new image has been selected (has uri)
  const hasNewImage = !!(current.image.uri && current.image.uri.length > 0);

  return hasNewImage;
};

/**
 * Validates if the personal details form data is ready for submission
 * @param data - The form data to validate
 * @returns true if the data is valid for submission
 */
export const isPersonalDetailsFormDataValid = (data: PersonalDetailsFormData): boolean => {
  return !!(data.email && data.first_name && data.last_name && data.gender && (data.image.uri || data.image.path));
};

/**
 * Creates a summary of changes between original and current form data
 * @param original - The original form data values
 * @param current - The current form data values
 * @returns An object describing what fields have changed
 */
export const getFormDataChanges = (original: PersonalDetailsFormData, current: PersonalDetailsFormData) => {
  const changes: Record<string, { from: string | Date | boolean; to: string | Date | boolean }> = {};

  const fieldsToCompare: (keyof Omit<PersonalDetailsFormData, "image">)[] = [
    "email",
    "first_name",
    "last_name",
    "gender",
  ];

  for (const field of fieldsToCompare) {
    if (original[field] !== current[field]) {
      changes[field] = {
        from: original[field],
        to: current[field],
      };
    }
  }

  // Check for image changes
  const hasNewImage = !!(current.image.uri && current.image.uri.length > 0);
  if (hasNewImage) {
    changes.image = {
      from: "existing",
      to: "new_image_selected",
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
  original: PersonalDetailsFormData,
  current: PersonalDetailsFormData,
  fieldName: keyof PersonalDetailsFormData,
): boolean => {
  if (fieldName === "image") {
    return !!(current.image.uri && current.image.uri.length > 0);
  }

  return original[fieldName] !== current[fieldName];
};
