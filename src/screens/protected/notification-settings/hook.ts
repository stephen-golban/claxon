import { useGetMe, useUpdateAccount } from "@/services/api/accounts";
import type { NotificationPreferencesFormData } from "./form/schema";
import { toast } from "@/components/ui/toast";

export default function useNotificationSettingsScreen() {
  // Query current user data to get notification preferences
  const { data: user, isPending, isLoading, error } = useGetMe();

  // Mutation hook for updating account
  const updateAccountMutation = useUpdateAccount();

  // Get notification preferences from user data or use defaults
  const notificationPreferences = user?.notification_preferences;

  const onSubmit = async (data: NotificationPreferencesFormData) => {
    if (!user || updateAccountMutation.isPending) return;

    // Update the user's notification preferences
    await updateAccountMutation.mutateAsync(
      {
        id: user.id,
        dto: {
          notification_preferences: data,
        },
      },
      {
        onSuccess: () => {
          toast.success("Notification preferences have been updated");
        },
      },
    );
  };

  return {
    // Data
    user,
    notificationPreferences,

    // Loading states
    isPending,
    isLoading,
    error,

    // Handlers
    onSubmit,
  };
}
