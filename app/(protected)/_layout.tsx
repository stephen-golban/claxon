import { Redirect, Stack } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers";
import { useAppStore } from "@/stores/app";

export default function ProtectedLayout() {
  const header = getProtectedHeader();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(unprotected)" />;
  }

  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
