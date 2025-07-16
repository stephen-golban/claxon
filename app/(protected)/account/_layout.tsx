import { Stack } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers";

export default function AccountLayout() {
  const { headerRight, ...header } = getProtectedHeader();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ ...header, headerRight }} />
      <Stack.Screen name="personal-details" options={{ ...header, presentation: "modal" }} />
      <Stack.Screen name="notification-settings" options={{ ...header, presentation: "modal" }} />
    </Stack>
  );
}
