import React from "react";

import { useTranslation } from "@/hooks";

import { CarIcon } from "@/components/icons";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { ellipsisString } from "@/lib/utils";

import type { VehicleColor } from "../../types";
/**
 * ColorDisplay - Internal component for displaying the selected color
 */

interface ColorDisplayProps {
  selectedColor: VehicleColor | undefined;
  placeholder: string;
  // biome-ignore lint/suspicious/noExplicitAny: we need to pass the event to the parent
  animatedStyle: any;
  correctedColor: string;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ placeholder, animatedStyle, selectedColor, correctedColor }) => {
  const { t } = useTranslation();

  return (
    <Animated.View style={animatedStyle} className="flex-1 items-center">
      {selectedColor ? (
        <View className="flex-row items-center gap-x-2">
          <CarIcon size={34} color={correctedColor} />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: correctedColor }}
            className="text-center text-sm font-medium text-dark dark:text-light"
          >
            {ellipsisString(t(`options:color:${selectedColor.code}`), 15)}
          </Text>
        </View>
      ) : (
        <Text className="text-center text-muted-foreground">{placeholder || t("labels:selectColor")}</Text>
      )}
    </Animated.View>
  );
};

export default React.memo(ColorDisplay);
