import { usePathname, useRouter } from "expo-router";
import { memo, type ReactNode, useMemo } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { View } from "react-native";
import { BellIcon, MoveLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/services/api/accounts";
import { ProfileAvatar } from "../profile-avatar";
import { ThemeSwitcher } from "../theme-switcher";

// Configuration for header visibility
const HEADER_CONFIG = {
  HIDE_GO_BACK: new Set(["/tabs"]),
  HIDE_HEADER: new Set(["/", "/personal-details"]),
} as const;

const getGoBackShouldHide = (pathname: string): boolean => {
  return HEADER_CONFIG.HIDE_GO_BACK.has(pathname);
};

const getHeaderShouldHide = (pathname: string): boolean => {
  return HEADER_CONFIG.HIDE_HEADER.has(pathname);
};

const HeaderLeft = memo((): ReactNode => {
  const router = useRouter();
  const pathname = usePathname();

  const shouldShow = useMemo(() => {
    return router.canGoBack() && !getGoBackShouldHide(pathname);
  }, [router, pathname]);

  if (!shouldShow) {
    return null;
  }

  return (
    <Button size="icon" variant="ghost" onPress={() => router.back()} className="active:bg-transparent my-4">
      <MoveLeftIcon className="text-primary" size={24} />
    </Button>
  );
});

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

  return (
    <View className="flex-row items-center gap-3 py-4">
      <ThemeSwitcher />
      <Button size="icon" variant="ghost" onPress={() => {}} className="active:bg-transparent relative">
        <BellIcon className="text-primary" size={24} />
        {/* {unreadCount && unreadCount.count > 0 && (
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
            <Text className="text-xs text-white font-bold">
              {unreadCount.count > 99 ? "99+" : unreadCount.count.toString()}
            </Text>
          </View>
        )} */}
      </Button>
      {me.data && (
        <ProfileAvatar
          first_name={me.data?.first_name}
          last_name={me.data?.last_name}
          bucket_avatar_url={me.data?.avatar_url}
          isLoading={me.isLoading || me.isPending}
        />
      )}
    </View>
  );
});

export const getProtectedHeader = (pathname: string) => {
  const shouldHideHeader = getHeaderShouldHide(pathname);

  if (shouldHideHeader) {
    return { headerShown: false };
  }

  return {
    headerLeft: () => <HeaderLeft />,
    headerRight: () => <HeaderRight />,
    headerTitleStyle,
    headerBackground,
  };
};
