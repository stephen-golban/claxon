import { ScrollView, View } from "react-native";

import { Container } from "@/components/common";
import { Text } from "@/components/ui/text";

import NotificationPreferencesForm from "./form";
import useNotificationSettingsScreen from "./hook";

export function NotificationSettingsScreen() {
  const { user, notificationPreferences, isPending, isLoading, error, isSubmitting, onSubmit } =
    useNotificationSettingsScreen();

  // Show loading state while fetching user data
  if (isPending || isLoading) {
    return (
      <Container>
        <Container.TopText title="Notification Settings" subtitle="Loading..." />
        <View className="flex-1 items-center justify-center">
          <Text>Loading notification preferences...</Text>
        </View>
      </Container>
    );
  }

  // Show error state if user data failed to load
  if (error || !user) {
    return (
      <Container>
        <Container.TopText title="Notification Settings" subtitle="Error loading preferences" />
        <View className="flex-1 items-center justify-center">
          <Text>Failed to load notification preferences</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
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
