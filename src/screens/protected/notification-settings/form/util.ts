import type { NotificationPreferencesFormData } from "./schema";

/**
 * Checks if notification preferences form data has changed from original values
 * @param original - The original notification preferences data
 * @param current - The current form values
 * @returns boolean indicating if any changes were made
 */
export const hasNotificationPreferencesChanged = (
  original: NotificationPreferencesFormData,
  current: NotificationPreferencesFormData,
): boolean => {
  // Check SMS settings changes
  const smsChanged = Object.keys(original.sms).some(
    (key) => original.sms[key as keyof typeof original.sms] !== current.sms[key as keyof typeof current.sms],
  );

  // Check Push settings changes
  const pushChanged = Object.keys(original.push).some(
    (key) => original.push[key as keyof typeof original.push] !== current.push[key as keyof typeof current.push],
  );

  return smsChanged || pushChanged;
};

/**
 * Gets a human-readable description for a notification setting
 * @param section - The notification section (sms or push)
 * @param setting - The specific setting key
 * @returns A descriptive string for the setting
 */
export const getSettingDescription = (section: "sms" | "push", setting: string): string => {
  const descriptions = {
    sms: {
      claxons: "Get notified when someone sends you a claxon",
      directMessages: "SMS notifications for direct messages from other users",
    },
    push: {
      newClaxons: "Push notifications when you receive new claxons",
      directMessages: "Push notifications for direct messages from other users",
      appUpdates: "Notifications about app updates and new features",
    },
  };

  return descriptions[section]?.[setting as keyof (typeof descriptions)[typeof section]] || "";
};

/**
 * Gets a human-readable title for a notification setting
 * @param section - The notification section (sms or push)
 * @param setting - The specific setting key
 * @returns A title string for the setting
 */
export const getSettingTitle = (section: "sms" | "push", setting: string): string => {
  const titles = {
    sms: {
      claxons: "Receive SMS Claxons",
      directMessages: "Direct Messages",
    },
    push: {
      newClaxons: "New Claxons",
      directMessages: "Direct Messages",
      appUpdates: "App Updates",
    },
  };

  return titles[section]?.[setting as keyof (typeof titles)[typeof section]] || setting;
};
