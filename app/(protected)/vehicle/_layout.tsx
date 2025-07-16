import { Stack } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers";

export default function VehicleLayout() {
  const header = getProtectedHeader();

  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="license-plate/[id]" options={{ presentation: "modal", headerRight: () => null }} />
    </Stack>
  );
}
