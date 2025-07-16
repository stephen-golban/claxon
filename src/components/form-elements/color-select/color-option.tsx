import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { type ColorValue, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { useColorOptionAnimation } from "./hook";
import type { ColorOptionProps } from "./types";
import { getColorName, getGradientColors, hasRgbaValue } from "./util";

/**
 * Individual color option component for the color picker
 */
export const ColorOption = React.memo<ColorOptionProps>(({ color, isSelected, onSelect, disabled }) => {
  const { t } = useTranslation();
  const { animatedStyle, handlePressIn, handlePressOut } = useColorOptionAnimation(disabled);

  const handlePress = React.useCallback(() => {
    if (!disabled) {
      onSelect(color.code);
    }
  }, [disabled, color.code, onSelect]);

  // Get translated color name
  const colorName = getColorName(color.code, t, color.description);

  // Handle colors without rgba values and create gradients for special colors
  const backgroundColor = color.rgba || "transparent";
  const hasPattern = !hasRgbaValue(color);
  const gradientColors = getGradientColors(color.code);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={colorName}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className="items-center p-2"
    >
      <Animated.View
        style={animatedStyle}
        className={cn(
          "w-16 h-16 rounded-2xl border-2 mb-2 overflow-hidden relative",
          isSelected ? "border-primary border-4" : "border-border",
          disabled && "opacity-50",
        )}
      >
        {gradientColors ? (
          <>
            <LinearGradient
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              colors={gradientColors as [ColorValue, ColorValue]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View className="flex-1 items-center justify-center">
              <Text className="text-xs font-bold text-white text-center" numberOfLines={1}>
                {color.code}
              </Text>
            </View>
          </>
        ) : (
          <View style={{ backgroundColor }} className={cn("flex-1", hasPattern && "items-center justify-center")}>
            {hasPattern && (
              <Text className="text-xs font-medium text-center text-foreground" numberOfLines={2}>
                {color.code}
              </Text>
            )}
          </View>
        )}
      </Animated.View>
      <Text className="text-xs text-center text-muted-foreground" numberOfLines={1}>
        {colorName}
      </Text>
    </Pressable>
  );
});

ColorOption.displayName = "ColorOption";
