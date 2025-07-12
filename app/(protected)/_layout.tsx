import { Redirect, Stack, usePathname } from "expo-router";
import { Suspense } from "react";
import { CustomSplashScreen } from "@/components/common";
import { getProtectedHeader } from "@/components/common/headers/protected";
import { usePrefetchGetMe } from "@/services/api/accounts";
import { useAppStore } from "@/stores/app";

export default function ProtectedLayout() {
  usePrefetchGetMe();

  const pathname = usePathname();
  const header = getProtectedHeader(pathname);

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(unprotected)" />;
  }

  return (
    <Suspense fallback={<CustomSplashScreen shouldFadeOut />}>
      <Stack>
        <Stack.Screen name="index" options={header} />
        <Stack.Screen name="personal-details" options={header} />
        <Stack.Screen name="tabs" options={header} />
      </Stack>
    </Suspense>
  );
}
