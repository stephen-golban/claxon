import { Redirect, Stack } from "expo-router";
import { getUnprotectedHeader } from "@/components/common/headers";
import { useAppStore } from "@/stores/app";

export default function UnprotectedLayout() {
  const header = getUnprotectedHeader();

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(protected)" />;
  }

  return <Stack screenOptions={header} />;
}
