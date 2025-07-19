import type { NativeStackHeaderRightProps } from "@react-navigation/native-stack";
import { usePathname, useRouter } from "expo-router";
import { memo, type ReactNode, useMemo } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Pressable, View } from "react-native";
import { MoveLeftIcon } from "@/components/icons";
import { ThemeSwitcher } from "../theme-switcher";

// Configuration for header visibility
const HEADER_CONFIG = {
  HIDE_GO_BACK: new Set(["/verify"]),
} as const;

const getGoBackShouldHide = (pathname: string): boolean => {
  return HEADER_CONFIG.HIDE_GO_BACK.has(pathname);
};

const HeaderLeft = memo(() => {
  const router = useRouter();
  const pathname = usePathname();

  const shouldShow = useMemo(() => {
    return router.canGoBack() && !getGoBackShouldHide(pathname);
  }, [router, pathname]);

  if (!shouldShow) {
    return null;
  }

  return (
    <Pressable onPress={() => router.back()} className="mt-5">
      <MoveLeftIcon className="text-primary" size={24} />
    </Pressable>
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

const HeaderRight = memo((_props: NativeStackHeaderRightProps): ReactNode => {
  return (
    <View className="flex-row items-center gap-x-4 py-3">
      {/* <LanguageSwitcher /> */}
      <ThemeSwitcher />
    </View>
  );
});

export const getUnprotectedHeader = () => {
  return {
    headerLeft: () => <HeaderLeft />,
    headerRight: () => <HeaderRight />,
    headerTitleStyle,
    headerBackground,
  };
};
