import { ScrollView } from "react-native";

import { Container, ErrorScreen } from "@/components/common";

import NotificationPreferencesForm from "./form";
import useNotificationSettingsScreen from "./hook";

export function NotificationSettingsScreen() {
  const { user, notificationPreferences, isPending, isLoading, error, isSubmitting, onSubmit } =
    useNotificationSettingsScreen();

  // Show error state if user data failed to load
  if (error || !user) {
    return <ErrorScreen message="Failed to load notification preferences" />;
  }

  return (
    <Container loading={isPending || isLoading}>
      <Container.TopText title="Notification Settings" subtitle="Manage how you receive notifications" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <NotificationPreferencesForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          initialData={notificationPreferences}
        />
      </ScrollView>
    </Container>
  );
}
