import type { NativeStackHeaderLeftProps } from "@react-navigation/native-stack";
import { usePathname, useRouter } from "expo-router";
import { memo, type ReactNode, useMemo } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { View } from "react-native";
import { MoveLeftIcon } from "@/components/icons";
import { ProfileAvatar } from "../profile-avatar";
import { ThemeSwitcher } from "../theme-switcher";

// Configuration for header visibility
const HEADER_CONFIG = {
  HIDE_GO_BACK: new Set(),
  HIDE_HEADER: new Set(),
} as const;

const getGoBackShouldHide = (pathname: string): boolean => {
  return HEADER_CONFIG.HIDE_GO_BACK.has(pathname);
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

const headerTitleStyle: StyleProp<
  Pick<TextStyle, "fontFamily" | "fontSize" | "fontWeight"> & {
    color?: string;
  }
> = {
  color: "transparent",
};

const headerBackground = () => <View className="bg-background" />;

const HeaderRight = memo((): ReactNode => {
  return (
    <View className="flex-row items-center gap-x-3">
      <ThemeSwitcher />

      <ProfileAvatar />
    </View>
  );
});

export const getProtectedHeader = (pathname: string) => {
  const shouldHideHeader = getHeaderShouldHide(pathname);

  if (shouldHideHeader) {
    return { headerShown: false };
  }

  return {
    headerLeft: (props: NativeStackHeaderLeftProps) => <HeaderLeft {...props} />,
    headerRight: () => <HeaderRight />,
    headerTitleStyle,
    headerBackground,
  };
};
