import type React from "react";
import { View } from "react-native";

import { useColorScheme, useTranslation } from "@/hooks";

import { CarIcon, XIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getBackgroundColor, getItemColor } from "./util";

import type { SelectedColor } from "../../types";

interface IModalHeader {
  onClose: () => void;
  selectedColor: SelectedColor;
}

const ModalHeader: React.FC<IModalHeader> = ({ selectedColor, onClose }) => {
  const { t } = useTranslation();
  const { isDark } = useColorScheme();

  const itemColor = getItemColor(selectedColor);
  const backgroundColor = getBackgroundColor(selectedColor, isDark) as string;

  return (
    <View className="flex-row items-center gap-x-4 border-b border-dark/10 px-6 py-4 dark:border-light/20">
      <View className="flex-1 flex-row items-center gap-x-4">
        <Button size="icon" variant="ghost" className="h-16 w-16" style={{ backgroundColor }}>
          <CarIcon size={34} color={itemColor} />
        </Button>

        <Text className="flex-1 text-xl font-bold text-dark dark:text-light">
          {t(`options:color:${selectedColor?.code}`)}
        </Text>
      </View>
      <XIcon size={24} onPress={onClose} className="text-foreground" />
    </View>
  );
};

export default ModalHeader;
