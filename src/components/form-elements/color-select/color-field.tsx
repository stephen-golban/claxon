import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { type ColorValue, Pressable, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { CarIcon, SwipeLeftIcon, SwipeRightIcon } from "@/components/icons";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { useCarScaleAnimation, useSwipeGesture } from "./hook";
import type { ColorFieldProps, ColorNavigationDirection } from "./types";
import { getCarColor, getColorName, getGradientColors, navigateToNextColor } from "./util";

/**
 * Main color field component with car icon, swipe controls, and tap to open picker
 */
export const ColorField = React.memo<ColorFieldProps>(
  ({ value, onChange, onOpenPicker, disabled, selectedColor, className }) => {
    const { t } = useTranslation();
    const { carAnimatedStyle } = useCarScaleAnimation(selectedColor);

    const navigateToColor = React.useCallback(
      (direction: ColorNavigationDirection) => {
        if (disabled) return;

        const newColor = navigateToNextColor(value, direction);
        if (newColor) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onChange(newColor.code);
        }
      },
      [disabled, value, onChange],
    );

    const { swipeGesture } = useSwipeGesture(navigateToColor, disabled);

    const openBottomSheet = React.useCallback(() => {
      if (!disabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onOpenPicker();
      }
    }, [disabled, onOpenPicker]);

    // Get colors and gradients for display
    const carColor = getCarColor(selectedColor);
    const mainFieldGradientColors = selectedColor ? getGradientColors(selectedColor.code) : null;

    return (
      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          className={cn(
            "bg-transparent-black dark:bg-transparent-white rounded-2xl p-4 border-2 border-transparent",
            disabled && "opacity-50",
            className,
          )}
        >
          <View className="flex-row items-center justify-between">
            {/* Left Swipe Control */}
            <Pressable
              onPress={() => navigateToColor("left")}
              disabled={disabled}
              className="p-2 rounded-full"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <SwipeLeftIcon size={20} color={disabled ? "#9CA3AF" : "#6B7280"} />
            </Pressable>

            {/* Center Content - Tappable for BottomSheet */}
            <Pressable
              onPress={openBottomSheet}
              disabled={disabled}
              className="flex-1 flex-row items-center justify-center gap-3 px-4"
            >
              <Animated.View style={carAnimatedStyle}>
                <CarIcon size={50} color={carColor} gradientColors={mainFieldGradientColors || undefined} />
              </Animated.View>
              <View className="flex-1">
                <Text className="text-lg font-medium text-foreground text-center">
                  {selectedColor
                    ? getColorName(selectedColor.code, selectedColor.description)
                    : t("placeholders:color")}
                </Text>
                <Text className="text-sm text-muted-foreground text-center">Swipe or tap for more</Text>
              </View>
              <View className="w-8 h-8 rounded-full border-2 border-border overflow-hidden relative">
                {mainFieldGradientColors ? (
                  <LinearGradient
                    end={{ x: 1, y: 1 }}
                    start={{ x: 0, y: 0 }}
                    colors={mainFieldGradientColors as [ColorValue, ColorValue]}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                  />
                ) : (
                  <View style={{ backgroundColor: carColor }} className="flex-1" />
                )}
              </View>
            </Pressable>

            {/* Right Swipe Control */}
            <Pressable
              onPress={() => navigateToColor("right")}
              disabled={disabled}
              className="p-2 rounded-full"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <SwipeRightIcon size={20} color={disabled ? "#9CA3AF" : "#6B7280"} />
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

ColorField.displayName = "ColorField";
