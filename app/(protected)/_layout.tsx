import { Redirect, Stack, usePathname } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers/protected";
import { useAppStore } from "@/stores/app";

export default function ProtectedLayout() {
  const pathname = usePathname();
  const header = getProtectedHeader(pathname);

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(unprotected)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={header} />
      <Stack.Screen name="personal-details" options={header} />
      <Stack.Screen name="tabs" options={header} />
    </Stack>
  );
}
