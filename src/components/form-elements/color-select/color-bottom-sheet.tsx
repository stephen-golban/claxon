import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { CarIcon } from "@/components/icons";
import { BottomSheet, BottomSheetContent, BottomSheetView, useBottomSheet } from "@/components/ui/bottom-sheet";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { VEHICLE_COLORS } from "@/lib/constants";
import { ColorOption } from "./color-option";
import { useCarScaleAnimation } from "./hook";
import type { ColorBottomSheetProps } from "./types";
import { getCarColor, getColorName, getGradientColors } from "./util";
import { FullWindowOverlay } from "react-native-screens";

/**
 * Bottom sheet component for full color selection
 */
export const ColorBottomSheet = React.memo<ColorBottomSheetProps>(
  ({ value, onChange, onClose, selectedColor, disabled, isOpen }) => {
    const { t } = useTranslation();
    const bottomSheet = useBottomSheet();
    const { carAnimatedStyle } = useCarScaleAnimation(selectedColor);

    // Open/close bottom sheet based on isOpen prop
    React.useEffect(() => {
      if (isOpen) {
        bottomSheet.open();
      } else {
        bottomSheet.close();
      }
    }, [isOpen, bottomSheet]);

    const handleColorSelect = React.useCallback(
      (colorCode: string) => {
        if (!disabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onChange(colorCode);
          onClose();
        }
      },
      [disabled, onChange, onClose],
    );

    const handleBackdropPress = React.useCallback(() => {
      onClose();
    }, [onClose]);

    // Get colors and gradients for display
    const carColor = getCarColor(selectedColor);
    const mainFieldGradientColors = selectedColor ? getGradientColors(selectedColor.code) : null;

    const containerComponent = useCallback(
      (props: React.PropsWithChildren) => <FullWindowOverlay>{props.children}</FullWindowOverlay>,
      [],
    );

    return (
      <BottomSheet>
        <BottomSheetContent
          containerComponent={containerComponent}
          ref={bottomSheet.ref}
          snapPoints={["70%"]}
          backdropProps={{
            opacity: 0.5,
            pressBehavior: "close",
            onPress: handleBackdropPress,
          }}
        >
          <BottomSheetView className="flex-1 px-6">
            {/* Header */}
            <View className="items-center mb-6">
              <Text className="text-xl font-bold text-foreground">{t("placeholders:color")}</Text>
              <Text className="text-sm text-muted-foreground">Choose your vehicle color</Text>
            </View>

            {/* Current Color Preview */}
            <View className="items-center py-4 mb-4 bg-transparent-black dark:bg-transparent-white rounded-2xl">
              <Animated.View style={carAnimatedStyle}>
                <CarIcon size={60} color={carColor} gradientColors={mainFieldGradientColors || undefined} />
              </Animated.View>
              {selectedColor && (
                <Text className="mt-2 text-lg font-bold text-foreground">
                  {getColorName(selectedColor.code, selectedColor.description)}
                </Text>
              )}
            </View>

            {/* Color Grid */}
            <View className="flex-1">
              <View className="flex-row flex-wrap gap-3 justify-center">
                {VEHICLE_COLORS.map((color) => (
                  <ColorOption
                    key={color.code}
                    isSelected={value === color.code}
                    color={color}
                    onSelect={handleColorSelect}
                    disabled={disabled}
                  />
                ))}
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetContent>
      </BottomSheet>
    );
  },
);

ColorBottomSheet.displayName = "ColorBottomSheet";
