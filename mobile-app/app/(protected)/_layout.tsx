import { ProtectedHeader } from "@/components/common/headers";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  const { headerLeft, ...header } = ProtectedHeader;

  return <Stack screenOptions={{ headerShown: true, ...header, headerLeft: (props) => headerLeft(props) }} />;
}
