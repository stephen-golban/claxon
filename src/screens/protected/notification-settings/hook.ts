import { useState } from "react";
import { useGetMe } from "@/services/api/accounts";
import type { NotificationPreferencesFormData } from "./form/schema";

export default function useNotificationSettingsScreen() {
  // Query current user data to get notification preferences
  const { data: user, isPending, isLoading, error } = useGetMe();

  // Mock mutation state - in real implementation this would be a mutation hook
  const [isSubmitting] = useState(false);

  // Get notification preferences from user data or use defaults
  const notificationPreferences = user?.notification_preferences;

  const onSubmit = async (data: NotificationPreferencesFormData) => {
    if (!user) return;

    // In real implementation, this would trigger an API call to save the preferences
    console.log("Saving notification preferences:", data);

    // Example API call structure:
    // await updateNotificationPreferences.mutateAsync({
    //   userId: user.id,
    //   preferences: data,
    // });
  };

  return {
    // Data
    user,
    notificationPreferences,

    // Loading states
    isPending,
    isLoading,
    error,
    isSubmitting,

    // Handlers
    onSubmit,
  };
}
