import type { NativeStackHeaderLeftProps } from "@react-navigation/native-stack";
import { usePathname, useRouter } from "expo-router";
import { memo, type ReactNode, useMemo } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { View } from "react-native";
import { MoveLeftIcon } from "@/components/icons";
import { useGetMe } from "@/services/api/accounts";
import { ProfileAvatar } from "../profile-avatar";
import { ThemeSwitcher } from "../theme-switcher";

// Configuration for header visibility
const HEADER_CONFIG = {
  HIDE_GO_BACK: new Set(["/tabs", "/tabs/[name]"]),
  HIDE_HEADER: new Set(),
} as const;

const getGoBackShouldHide = (pathname: string): boolean => {
  // Check exact matches first
  if (HEADER_CONFIG.HIDE_GO_BACK.has(pathname)) {
    return true;
  }

  // Check pattern matches for routes with [name] wildcards
  for (const route of HEADER_CONFIG.HIDE_GO_BACK) {
    if (route.includes("[") && route.includes("]")) {
      // Convert route pattern to regex by replacing [name] with [^/]+
      const regexPattern = route.replace(/\[([^\]]+)\]/g, "[^/]+");
      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(pathname)) {
        return true;
      }
    }
  }

  return false;
};

const getHeaderShouldHide = (pathname: string): boolean => {
  return HEADER_CONFIG.HIDE_HEADER.has(pathname);
};

const HeaderLeft = memo((props: NativeStackHeaderLeftProps): ReactNode => {
  const router = useRouter();
  const pathname = usePathname();

  const shouldShow = useMemo(() => {
    return props.canGoBack && !getGoBackShouldHide(pathname);
  }, [pathname, props.canGoBack]);

  if (!shouldShow) {
    return null;
  }

  return <MoveLeftIcon className="text-primary mt-2" size={24} onPress={() => router.back()} />;
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

  return (
    <View className="flex-row items-center gap-x-3 mt-2 mb-4">
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
  );
});

HeaderRight.displayName = "HeaderRight";

// Memoized header components to prevent recreation
const memoizedHeaderLeft = (props: NativeStackHeaderLeftProps) => <HeaderLeft {...props} />;
const memoizedHeaderRight = () => <HeaderRight />;

export const getProtectedHeader = (pathname: string) => {
  const shouldHideHeader = getHeaderShouldHide(pathname);

  if (shouldHideHeader) {
    return { headerShown: false };
  }

  return {
    headerLeft: memoizedHeaderLeft,
    headerRight: memoizedHeaderRight,
    headerTitleStyle,
    headerBackground,
  };
};
