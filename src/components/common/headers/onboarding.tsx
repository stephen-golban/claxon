import type { NativeStackHeaderRightProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { View } from "react-native";
import { MoveLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "../theme-switcher";

const HeaderLeft = (showBackButton = true, onBack = () => {}): ReactNode => {
  if (!showBackButton) {
    return <View />;
  }

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  return (
    <Button size="icon" variant="ghost" onPress={handleBackPress} className="my-3">
      <MoveLeftIcon className="text-primary" size={24} />
    </Button>
  );
};

const headerTitleStyle: StyleProp<
  Pick<TextStyle, "fontFamily" | "fontSize" | "fontWeight"> & {
    color?: string;
  }
> = {
  color: "transparent",
};

const headerBackground = () => <View className="bg-background" />;

const HeaderRight = (_props: NativeStackHeaderRightProps): ReactNode => {
  return (
    <View className="flex-row items-center gap-x-4 py-3">
      {/* <LanguageSwitcher /> */}
      <ThemeSwitcher />
    </View>
  );
};

export const OnboardingHeader = {
  headerLeft: (showBackButton?: boolean, onBack?: () => void) => HeaderLeft(showBackButton, onBack),
  headerRight: HeaderRight,
  headerTitleStyle,
  headerBackground,
};
