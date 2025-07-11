import React from "react";
import {
  type GestureResponderEvent,
  PanResponder,
  type PanResponderGestureState,
  type PanResponderInstance,
} from "react-native";

interface UsePanGestureProps {
  onNextColor: () => void;
  onPreviousColor: () => void;
  onOpenPalette: () => void;
  disabled?: boolean;
}

/**
 * Custom hook that provides pan gesture handling for the color selector
 * Allows swiping left/right to change colors
 */
export default function usePanGesture({ onNextColor, onPreviousColor, disabled = false }: UsePanGestureProps) {
  // Setup Pan Responder for swipe gestures
  const panResponder: PanResponderInstance = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onStartShouldSetPanResponderCapture: () => !disabled,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return !disabled && Math.abs(gestureState.dx) > 5;
        },
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          return !disabled && Math.abs(gestureState.dx) > 5;
        },
        onPanResponderGrant: () => {
          // Prevent parent scroll/other gestures
          return true;
        },
        onPanResponderMove: () => {},
        onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          // Handle swipe gesture when released
          const { dx } = gestureState;

          // Prevent default behavior to stop screen movement
          evt.preventDefault?.();

          // Minimum distance threshold to consider it a swipe
          if (Math.abs(dx) > 30) {
            if (dx > 0) {
              // Swipe right - select previous color
              onPreviousColor();
            } else {
              // Swipe left - select next color
              onNextColor();
            }
          }
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderTerminate: () => {
          return false;
        },
        onShouldBlockNativeResponder: () => true,
      }),
    [disabled, onNextColor, onPreviousColor],
  );

  return panResponder;
}
