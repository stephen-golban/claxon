import { Redirect, Stack } from "expo-router";
import { useAppStore } from "@/stores/app";

export default function ProtectedLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(unprotected)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
