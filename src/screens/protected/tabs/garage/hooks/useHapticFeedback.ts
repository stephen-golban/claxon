import * as Haptics from "expo-haptics";
import { useCallback } from "react";

/**
 * Custom hook for haptic feedback following Single Responsibility Principle
 * Provides consistent haptic feedback patterns across the garage screen
 */

export interface HapticFeedback {
  light: () => void;
  medium: () => void;
  heavy: () => void;
  success: () => void;
}

export const useHapticFeedback = (): HapticFeedback => {
  const light = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const medium = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const heavy = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const success = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return {
    light,
    medium,
    heavy,
    success,
  };
};
