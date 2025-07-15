import type { NativeStackHeaderLeftProps } from "@react-navigation/native-stack";
import { memo, type ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Pressable, View } from "react-native";
import { MoveLeftIcon } from "@/components/icons";
import type { Account } from "@/services/api/accounts";
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

interface IHeaderLeftProps extends NativeStackHeaderLeftProps {
  pathname: string;
  goBack: () => void;
}

const HeaderLeft = memo((props: IHeaderLeftProps): ReactNode => {
  const { pathname, goBack, canGoBack } = props;
  console.log("render-left");

  const shouldShow = canGoBack && !getGoBackShouldHide(pathname);

  if (!shouldShow) return null;

  return (
    <Pressable onPress={goBack} className="mt-2">
      <MoveLeftIcon className="text-primary" size={24} />
    </Pressable>
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

interface IHeaderRightProps {
  isLoading: boolean;
  data: Account | undefined;
}

const HeaderRight = memo(
  (props: IHeaderRightProps): ReactNode => {
    const { data, isLoading } = props;
    console.log("render-right");

    return (
      <View className="flex-row items-center gap-x-3">
        <ThemeSwitcher />
        {data && (
          <ProfileAvatar
            isMeLoading={isLoading}
            last_name={data?.last_name}
            first_name={data?.first_name}
            avatar_url={data?.avatar_url}
          />
        )}
      </View>
    );
  },
  (prev, next) => {
    return prev.isLoading === next.isLoading && prev.data?.id === next.data?.id;
  },
);

HeaderRight.displayName = "HeaderRight";

export const getProtectedHeader = (
  pathname: string,
  goBack: () => void,
  me: Account | undefined,
  isLoading: boolean,
) => {
  const shouldHideHeader = getHeaderShouldHide(pathname);

  if (shouldHideHeader) return { headerShown: false };

  return {
    headerTitleStyle,
    headerBackground,
    headerRight: () => <HeaderRight data={me} isLoading={isLoading} />,
    headerLeft: (props: NativeStackHeaderLeftProps) => <HeaderLeft {...props} pathname={pathname} goBack={goBack} />,
  };
};
