import { UnprotectedHeader } from "@/components/common/headers";
import { Stack } from "expo-router";

export default function UnprotectedLayout() {
  const { headerLeft, ...header } = UnprotectedHeader;

  return <Stack screenOptions={{ headerShown: true, ...header, headerLeft: () => headerLeft(true) }} />;
}
