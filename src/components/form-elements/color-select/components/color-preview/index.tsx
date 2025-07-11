import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { type ColorValue, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PaletteIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { VEHICLE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import usePanGesture from "../../hook";
import type { VehicleColor } from "../../types";
import { CAMOUFLAGE_COLORS, MULTICOLOR_COLORS } from "../color-palette-modal/util";
import ColorDisplay from "./color-display";
import NavigationButton from "./navigation-button";
import { LIGHT_COLORS, provideFeedbackAnimation } from "./utils";

interface IColorPreview {
  selectedColorIndex: number;
  colorOptions?: VehicleColor[];
  onNextColor: () => void;
  onPreviousColor: () => void;
  onOpenPalette: () => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

/**
 * Component that displays the currently selected color with navigation controls
 */
const ColorPreview: React.FC<IColorPreview> = ({
  error,
  onNextColor,
  placeholder,
  colorOptions,
  onOpenPalette,
  onPreviousColor,
  disabled = false,
  selectedColorIndex,
}) => {
  // Use the provided color options or default to VEHICLE_COLORS
  const colors = React.useMemo(() => colorOptions ?? [...VEHICLE_COLORS], [colorOptions]);

  // Calculate derived state values
  const { isFirstColor, isLastColor, selectedColor, currentColor, isMulticolor } = React.useMemo(() => {
    const isFirstColor = selectedColorIndex === 0;
    const isLastColor = colors.length === selectedColorIndex + 1;
    const selectedColor = colors[selectedColorIndex];
    const isMulticolor = selectedColor?.code === "MUL" || selectedColor?.code === "CAM";
    const currentColor = isMulticolor ? undefined : selectedColor?.rgba;

    return {
      isFirstColor,
      isLastColor,
      selectedColor,
      currentColor,
      isMulticolor,
    };
  }, [selectedColorIndex, colors]);

  // Simple animation scale for feedback
  const animatedScale = useSharedValue(1);

  // Animation values for button visibility
  const prevButtonOpacity = useSharedValue(isFirstColor ? 0 : 1);
  const nextButtonOpacity = useSharedValue(isLastColor ? 0 : 1);

  // Update the opacity animations when first/last status changes
  React.useEffect(() => {
    prevButtonOpacity.value = withTiming(isFirstColor ? 0 : 1, {
      duration: 300,
    });
  }, [isFirstColor, prevButtonOpacity]);

  React.useEffect(() => {
    nextButtonOpacity.value = withTiming(isLastColor ? 0 : 1, {
      duration: 300,
    });
  }, [isLastColor, nextButtonOpacity]);

  // Handle navigation between colors
  const handlePreviousPress = () => {
    if (disabled || isFirstColor) return;
    provideFeedbackAnimation(animatedScale);
    onPreviousColor();
  };

  const handleNextPress = () => {
    if (disabled || isLastColor) return;
    provideFeedbackAnimation(animatedScale);
    onNextColor();
  };

  // Create animated preview style for feedback
  const animatedPreviewStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedScale.value }],
  }));

  // Create animated styles for the buttons
  const prevButtonStyle = useAnimatedStyle(() => ({
    opacity: prevButtonOpacity.value,
    // Prevent interaction when fully transparent
    pointerEvents: prevButtonOpacity.value === 0 ? "none" : "auto",
  }));

  const nextButtonStyle = useAnimatedStyle(() => ({
    opacity: nextButtonOpacity.value,
    // Prevent interaction when fully transparent
    pointerEvents: nextButtonOpacity.value === 0 ? "none" : "auto",
  }));

  // Set up pan gesture handler
  const panResponder = usePanGesture({
    onNextColor: handleNextPress,
    onPreviousColor: handlePreviousPress,
    onOpenPalette,
    disabled,
  });

  const correctedColor = LIGHT_COLORS.includes(selectedColor?.code || "") ? "black" : "white";

  return (
    <View className="flex-row items-center gap-x-4">
      <View className="relative w-full flex-1 flex-row items-center">
        {/* Main Color Preview */}
        <View
          {...panResponder.panHandlers}
          className={cn(
            "h-16 flex-1 flex-row items-center justify-between rounded-2xl border border-transparent px-4",
            error && "border-destructive bg-destructive/10 text-destructive dark:bg-destructive/10",
          )}
          style={{ backgroundColor: currentColor }}
        >
          {isMulticolor && (
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFillObject, { borderRadius: 16 }]}
              colors={
                (selectedColor?.code === "MUL" ? MULTICOLOR_COLORS : CAMOUFLAGE_COLORS) as [ColorValue, ColorValue]
              }
            />
          )}

          {/* Previous button inside the color preview */}
          <Animated.View style={prevButtonStyle}>
            {!disabled && (
              <NavigationButton
                direction="left"
                onPress={handlePreviousPress}
                disabled={isFirstColor}
                correctedColor={correctedColor}
                animatedStyle={animatedPreviewStyle}
              />
            )}
          </Animated.View>

          {/* Color display in the center */}
          <ColorDisplay
            selectedColor={selectedColor}
            placeholder={placeholder || ""}
            correctedColor={correctedColor}
            animatedStyle={animatedPreviewStyle}
          />

          {/* Next button inside the color preview */}
          <Animated.View style={nextButtonStyle}>
            {!disabled && (
              <NavigationButton
                direction="right"
                onPress={handleNextPress}
                disabled={isLastColor}
                correctedColor={correctedColor}
                animatedStyle={animatedPreviewStyle}
              />
            )}
          </Animated.View>
        </View>
      </View>

      <Button
        onPress={onOpenPalette}
        disabled={disabled}
        style={{ backgroundColor: currentColor }}
        className="rounded-2xl"
      >
        {isMulticolor && (
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 16 }]}
            colors={(selectedColor?.code === "MUL" ? MULTICOLOR_COLORS : CAMOUFLAGE_COLORS) as [ColorValue, ColorValue]}
          />
        )}
        <PaletteIcon size={24} color={correctedColor} />
      </Button>
    </View>
  );
};

export default React.memo(ColorPreview);
