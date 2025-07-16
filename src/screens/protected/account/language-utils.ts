// Language options enum
export const LANGUAGE_OPTIONS = {
  en: "English",
  ro: "Romanian",
  ru: "Russian",
} as const;

export type LanguageCode = keyof typeof LANGUAGE_OPTIONS;

/**
 * Gets the display name for a language code
 * @param languageCode - The language code
 * @returns The human-readable language name
 */
export const getLanguageDisplayName = (languageCode: LanguageCode | string | null): string => {
  if (!languageCode || !(languageCode in LANGUAGE_OPTIONS)) {
    return LANGUAGE_OPTIONS.ro; // Default to Romanian
  }
  return LANGUAGE_OPTIONS[languageCode as LanguageCode];
};

/**
 * Gets all available language options as an array for Select component
 * @returns Array of language options with value and label
 */
export const getLanguageOptions = () => {
  return Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => ({
    value: code,
    label: name,
  }));
};

/**
 * Gets a description for a language option
 * @param languageCode - The language code
 * @returns A descriptive string for the language
 */
export const getLanguageDescription = (languageCode: LanguageCode): string => {
  const descriptions = {
    en: "Set English as your preferred language for the app interface",
    ro: "Setează româna ca limba preferată pentru interfața aplicației",
    ru: "Установить русский язык в качестве предпочтительного для интерфейса приложения",
  };

  return descriptions[languageCode];
};

/**
 * Validates if a language code is valid
 * @param languageCode - The language code to validate
 * @returns boolean indicating if the language code is valid
 */
export const isValidLanguageCode = (languageCode: string): languageCode is LanguageCode => {
  return languageCode in LANGUAGE_OPTIONS;
};
