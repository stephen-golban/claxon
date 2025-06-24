import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { type ColorValue, StyleSheet, View } from "react-native";

import { CarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { cn } from "@/lib/utils";
import { getBackgroundColor, getItemColor } from "./util";

import { useColorScheme, useTranslation } from "@/hooks";
import { useAppStore } from "@/stores/app";
import type { VehicleColor } from "../../types";

interface IModalListItem {
  onPress(): void;
  item: VehicleColor;
  isSelected: boolean;
}

const ModalListItem: React.FC<IModalListItem> = ({ item, onPress, isSelected }) => {
  const { t } = useTranslation();
  const { isDark } = useColorScheme();
  const language = useAppStore((state) => state.language);

  const itemColor = getItemColor(item);
  const backgroundColor = getBackgroundColor(item, isDark);
  const isGradient = Array.isArray(backgroundColor);

  return (
    <Button
      size="icon"
      variant="ghost"
      onPress={onPress}
      style={isGradient ? undefined : { backgroundColor: backgroundColor || undefined }}
      className={cn(
        "h-28 w-28 border border-transparent relative overflow-hidden",
        isSelected && "border-dark/10 dark:border-light/20",
        (item.code as string) === "placeholder" && "opacity-0",
      )}
    >
      {isGradient && (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: 6 }]}
          colors={backgroundColor as unknown as [ColorValue, ColorValue]}
        />
      )}
      <View style={[styles.iconContainer, { shadowColor: itemColor }]}>
        <CarIcon size={34} color={itemColor} />
        <Text
          className="text-sm text-foreground"
          style={[language === "ru" && { fontSize: 12 }, isGradient && { color: "white" }]}
        >
          {t(`options:color:${item.code}`)}
        </Text>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default ModalListItem;
