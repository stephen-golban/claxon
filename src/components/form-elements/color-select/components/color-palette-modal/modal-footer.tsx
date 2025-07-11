import type React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks";

interface IModalFooter {
  disabled: boolean;
  onColorSelect: () => void;
}

const ModalFooter: React.FC<IModalFooter> = ({ onColorSelect, disabled }) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{ marginBottom: bottom }} className="pt-4 px-6 border-t border-dark/10 dark:border-light/20">
      <Button size="lg" onPress={onColorSelect} disabled={disabled}>
        <Text className="text-light dark:text-dark">{t("buttons:confirm")}</Text>
      </Button>
    </View>
  );
};

export default ModalFooter;
