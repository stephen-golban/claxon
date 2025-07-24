import { Stack } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers";

export default function AccountLayout() {
  const { headerRight: _, ...header } = getProtectedHeader();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ ...header }} />
      <Stack.Screen name="personal-details" options={{ ...header, presentation: "modal" }} />
      <Stack.Screen name="notification-settings" options={{ ...header, presentation: "modal" }} />
    </Stack>
  );
}
