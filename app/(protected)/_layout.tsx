import { Redirect, Stack } from "expo-router";
import { useAppStore } from "@/stores/app";

export default function ProtectedLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(unprotected)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="tabs" />
      <Stack.Screen name="account" options={{ presentation: "modal" }} />
      <Stack.Screen name="vehicle" options={{ presentation: "modal" }} />
    </Stack>
  );
}
