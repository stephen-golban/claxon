import { Redirect, Stack, usePathname } from "expo-router";
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

  return <Stack screenOptions={header} />;
}
