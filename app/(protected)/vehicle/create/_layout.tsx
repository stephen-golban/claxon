import { Stack } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers";

export default function VehicleCreateLayout() {
  const { headerRight: _, ...header } = getProtectedHeader();

  return (
    <Stack>
      <Stack.Screen name="index" options={header} />
      <Stack.Screen name="license-plate" options={header} />
    </Stack>
  );
}
