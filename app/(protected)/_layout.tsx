import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { getProtectedHeader } from "@/components/common/headers";
import { useGetMe } from "@/services/api/accounts";
import { useAppStore } from "@/stores/app";

export default function ProtectedLayout() {
  const me = useGetMe();
  const router = useRouter();
  const pathname = usePathname();
  const header = getProtectedHeader(pathname, router.back, me.data, me.isPending || me.isLoading);

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(unprotected)" />;
  }

  return <Stack screenOptions={header} />;
}
