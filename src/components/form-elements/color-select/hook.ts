import React from "react";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import type { ColorNavigationDirection, VehicleColor } from "./types";

/**
 * Hook for car scaling animation when color changes
 */
export const useCarScaleAnimation = (selectedColor: VehicleColor | undefined) => {
  const carScale = useSharedValue(1);

  // Animate car when color changes
  React.useEffect(() => {
    if (selectedColor) {
      carScale.value = withSpring(1.1, { damping: 15, stiffness: 300 }, () => {
        carScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      });
    }
  }, [selectedColor, carScale]);

  const carAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: carScale.value }],
  }));

  return { carAnimatedStyle };
};

/**
 * Hook for color option press animation
 */
export const useColorOptionAnimation = (disabled?: boolean) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = React.useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    }
  }, [disabled, scale]);

  const handlePressOut = React.useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  }, [disabled, scale]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
};

/**
 * Hook for swipe gesture handling on the color field
 */
export const useSwipeGesture = (onNavigate: (direction: ColorNavigationDirection) => void, disabled?: boolean) => {
  const swipeTranslateX = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!disabled) {
        swipeTranslateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (!disabled) {
        const threshold = 50;
        if (Math.abs(event.translationX) > threshold) {
          if (event.translationX > 0) {
            runOnJS(onNavigate)("left");
          } else {
            runOnJS(onNavigate)("right");
          }
        }
        swipeTranslateX.value = withSpring(0);
      }
    });

  return { swipeGesture };
};
