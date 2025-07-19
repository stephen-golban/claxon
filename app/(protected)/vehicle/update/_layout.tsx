import { Stack } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers";

export default function VehicleUpdateLayout() {
  const header = getProtectedHeader();

  return <Stack screenOptions={header} />;
}
