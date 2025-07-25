import { router, usePathname } from "expo-router";

import { memo, type ReactNode, useMemo } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { View } from "react-native";
import { MoveLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetMe } from "@/services/api/accounts";
import { useGoBackStore } from "@/stores/go-back";
import { ProfileAvatar } from "../profile-avatar";
import { ThemeSwitcher } from "../theme-switcher";

type HeaderConfig = {
  HIDE_GO_BACK: Set<string>;
};

const HEADER_CONFIG: HeaderConfig = {
  HIDE_GO_BACK: new Set(["/tabs/[name]"]),
} as const;

const createRoutePatternMatcher = (routes: Set<string>) => {
  return (pathname: string): boolean => {
    for (const route of routes) {
      if (route === pathname) return true;

      if (route.includes("[") && route.includes("]")) {
        const regexPattern = route.replace(/\[([^\]]+)\]/g, "[^/]+");
        const regex = new RegExp(`^${regexPattern}$`);
        if (regex.test(pathname)) return true;
      }
    }
    return false;
  };
};

const useRouteMatchers = () => {
  return useMemo(
    () => ({
      shouldHideGoBack: createRoutePatternMatcher(HEADER_CONFIG.HIDE_GO_BACK),
    }),
    [],
  );
};

const useHeaderState = () => {
  const pathname = usePathname();
  const { shouldHideGoBack } = useRouteMatchers();

  return useMemo(
    () => ({
      pathname,
      shouldHideGoBack: shouldHideGoBack(pathname),
    }),
    [pathname, shouldHideGoBack],
  );
};

const HeaderLeft = memo((): ReactNode => {
  const canGoBack = router.canGoBack();
  const { shouldHideGoBack } = useHeaderState();
  const { goBack, hideGoBack } = useGoBackStore();

  const shouldShow = canGoBack && !shouldHideGoBack && !hideGoBack;

  if (!shouldShow) return null;

  const handleGoBack = () => {
    if (goBack && typeof goBack === "function") {
      goBack();
    } else {
      router.back();
    }
  };

  return (
    <Button size="icon" variant="ghost" onPress={handleGoBack} className="mt-5 -ml-2">
      <MoveLeftIcon size={24} className="text-foreground" />
    </Button>
  );
});

HeaderLeft.displayName = "HeaderLeft";

const HEADER_STYLES = {
  title: {
    color: "transparent",
  } as StyleProp<Pick<TextStyle, "fontFamily" | "fontSize" | "fontWeight"> & { color?: string }>,
} as const;

const HeaderBackground = () => <View className="bg-background" />;

const HeaderRight = memo((): ReactNode => {
  const me = useGetMe();

  return (
    <View className={cn("flex-row items-center gap-x-4 mt-4 mr-0")}>
      <ThemeSwitcher />
      {me.data && (
        <ProfileAvatar
          last_name={me.data.last_name}
          first_name={me.data.first_name}
          avatar_url={me.data.avatar_url}
          isMeLoading={me.isPending || me.isLoading}
        />
      )}
    </View>
  );
});

HeaderRight.displayName = "HeaderRight";

export const getProtectedHeader = () => ({
  headerLeft: () => <HeaderLeft />,
  headerRight: () => <HeaderRight />,
  headerTitleStyle: HEADER_STYLES.title,
  headerBackground: HeaderBackground,
});
