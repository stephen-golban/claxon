import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Json } from "@/typings/database";

// SMS notifications schema
const smsNotificationsSchema = z.object({
  claxons: z.boolean(),
  directMessages: z.boolean(),
});

// Push notifications schema
const pushNotificationsSchema = z.object({
  newClaxons: z.boolean(),
  directMessages: z.boolean(),
  appUpdates: z.boolean(),
});

// Complete notification preferences schema
export const notificationPreferencesSchema = z.object({
  sms: smsNotificationsSchema,
  push: pushNotificationsSchema,
});

export type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>;
export type SmsSettings = z.infer<typeof smsNotificationsSchema>;
export type PushSettings = z.infer<typeof pushNotificationsSchema>;

export const defaultValues: NotificationPreferencesFormData = {
  sms: {
    claxons: true,
    directMessages: false,
  },
  push: {
    newClaxons: true,
    directMessages: true,
    appUpdates: false,
  },
};

export const resolver = zodResolver(notificationPreferencesSchema);

// Type for notification preferences from API
export interface NotificationPreferencesAPI {
  sms?: Partial<SmsSettings>;
  push?: Partial<PushSettings>;
}

/**
 * Transforms notification preferences data from the API to form data format
 * @param preferences - The notification preferences data from API
 * @returns NotificationPreferencesFormData with preferences data or default values
 */
export const transformPreferencesToFormData = (preferences: Json | undefined): NotificationPreferencesFormData => {
  if (!preferences) {
    return defaultValues;
  }

  const typedPreferences = preferences as NotificationPreferencesAPI;

  return {
    sms: {
      claxons: typedPreferences.sms?.claxons ?? defaultValues.sms.claxons,
      directMessages: typedPreferences.sms?.directMessages ?? defaultValues.sms.directMessages,
    },
    push: {
      newClaxons: typedPreferences.push?.newClaxons ?? defaultValues.push.newClaxons,
      directMessages: typedPreferences.push?.directMessages ?? defaultValues.push.directMessages,
      appUpdates: typedPreferences.push?.appUpdates ?? defaultValues.push.appUpdates,
    },
  };
};
