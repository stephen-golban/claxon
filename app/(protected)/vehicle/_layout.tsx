import { Stack } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers";

export default function VehicleLayout() {
  const header = getProtectedHeader();

  return (
    <Stack>
      <Stack.Screen name="create" options={header} />
      <Stack.Screen name="[id]" options={header} />
      <Stack.Screen name="license-plate" options={{ presentation: "modal", ...header, headerRight: () => null }} />
    </Stack>
  );
}
