import React from "react";
import { Modal, View } from "react-native";
import { VEHICLE_COLORS } from "@/lib/constants";
import ModalFooter from "./modal-footer";
import ModalHeader from "./modal-header";
import ModalList from "./modal-list";

type ColorPaletteModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onColorSelect: (index: number) => void;
  selectedColorIndex: number;
};

/**
 * Modal component that displays all available colors in a grid
 */
const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  isVisible,
  onClose,
  onColorSelect,
  selectedColorIndex,
}) => {
  const [innerSelectedIndex, setInnerSelectedIndex] = React.useState(selectedColorIndex);

  const selectedColor = VEHICLE_COLORS[innerSelectedIndex];

  return (
    <Modal transparent visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-background pt-14">
        <ModalHeader onClose={onClose} selectedColor={selectedColor} />
        <ModalList selectedColorIndex={innerSelectedIndex} onColorSelect={(idx) => setInnerSelectedIndex(idx)} />
        <ModalFooter
          disabled={innerSelectedIndex === selectedColorIndex}
          onColorSelect={() => onColorSelect(innerSelectedIndex)}
        />
      </View>
    </Modal>
  );
};

export default React.memo(ColorPaletteModal);
