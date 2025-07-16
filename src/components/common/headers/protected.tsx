import { usePathname, useRouter } from "expo-router";
import { CarIcon } from "lucide-react-native";
import { memo, type ReactNode, useMemo } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { View } from "react-native";
import { MoveLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/services/api/accounts";
import { ProfileAvatar } from "../profile-avatar";
import { ThemeSwitcher } from "../theme-switcher";

// Configuration for header visibility
const HEADER_CONFIG = {
  HIDE_GO_BACK: new Set(["/", "/inbox", "/my-cars", "/account"]),
  HIDE_HEADER: new Set(),
} as const;

const getGoBackShouldHide = (pathname: string): boolean => {
  // Check exact matches first
  if (HEADER_CONFIG.HIDE_GO_BACK.has(pathname)) {
    return true;
  }

  return false;
};

const HeaderLeft = memo((): ReactNode => {
  const router = useRouter();
  const pathname = usePathname();
  const canGoBack = router.canGoBack();

  const shouldShow = useMemo(() => {
    return canGoBack && !getGoBackShouldHide(pathname);
  }, [pathname, canGoBack]);

  if (!shouldShow) {
    return null;
  }

  return (
    <Button onPress={() => router.back()} size="icon" variant="ghost" className="ml-2 mt-4">
      <MoveLeftIcon size={24} />
    </Button>
  );
});

HeaderLeft.displayName = "HeaderLeft";

const headerTitleStyle: StyleProp<
  Pick<TextStyle, "fontFamily" | "fontSize" | "fontWeight"> & {
    color?: string;
  }
> = {
  color: "transparent",
};

const headerBackground = () => <View className="bg-background" />;

const HeaderRight = memo((): ReactNode => {
  const me = useGetMe();
  const router = useRouter();

  return (
    <View className="mr-5">
      <View className="h-4" />
      <View className="flex-row items-center gap-x-3">
        <Button size="icon" variant="ghost" onPress={() => router.replace("/(protected)")}>
          <CarIcon size={24} disabled />
          <View className="absolute top-0 right-0 w-3 h-3 rounded-full bg-destructive" />
        </Button>
        <ThemeSwitcher />
        {me.data && (
          <ProfileAvatar
            last_name={me.data?.last_name}
            first_name={me.data?.first_name}
            avatar_url={me.data?.avatar_url}
            isMeLoading={me.isPending || me.isLoading}
          />
        )}
      </View>
    </View>
  );
});

HeaderRight.displayName = "HeaderRight";

// Memoized header components to prevent recreation
const memoizedHeaderLeft = () => <HeaderLeft />;
const memoizedHeaderRight = () => <HeaderRight />;

export const getProtectedHeader = () => {
  return {
    headerLeft: memoizedHeaderLeft,
    headerRight: memoizedHeaderRight,
    headerTitleStyle,
    headerBackground,
  };
};
