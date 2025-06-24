import React from "react";

import { SwipeLeftIcon, SwipeRightIcon } from "@/components/icons";
import { TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
/**
 * NavigationButton - Internal component for color navigation buttons
 */

interface NavigationButtonProps {
  direction: "left" | "right";
  onPress: () => void;
  disabled: boolean;
  correctedColor: string;
  // biome-ignore lint/suspicious/noExplicitAny: we need to pass the event to the parent
  animatedStyle?: any;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onPress,
  disabled,
  correctedColor,
  animatedStyle, // No longer used
}) => {
  const Icon = direction === "left" ? SwipeLeftIcon : SwipeRightIcon;

  return (
    <AnimatedTouchableOpacity onPress={onPress} disabled={disabled} style={[animatedStyle]}>
      <Icon color={correctedColor} size={20} />
    </AnimatedTouchableOpacity>
  );
};

export default React.memo(NavigationButton);
