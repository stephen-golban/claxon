import { useEffect, useRef } from "react";
import type { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from "react-native";
import type { BaseRenderPlateProps } from "./type";

export default function useBasePlate(props: BaseRenderPlateProps) {
  const { maskLeft, maskRight, onLeftChange, onRightChange, right, type } = props;
  const leftInputRef = useRef<TextInput>(null);
  const rightInputRef = useRef<TextInput>(null);

  const isSpecialPlate = type.includes("cars.special") && type !== "cars.special.diplomatic";

  // For special plates (except diplomatic), ensure the left value is set to the non-editable text
  useEffect(() => {
    if (isSpecialPlate && maskLeft?.nonEditableText && props.left !== maskLeft.nonEditableText) {
      onLeftChange(maskLeft.nonEditableText);
    }
  }, [isSpecialPlate, maskLeft?.nonEditableText, props.left, onLeftChange]);

  // Convert maskLetters and maskNumbers to appropriate format
  // Replace each character with a placeholder that matches what the mask expects
  const formatMask = (mask: string) => {
    const newMask = mask;
    return newMask.replace(/[A-Z]/g, "A").replace(/[0-9]/g, "9");
  };

  // Create properly formatted masks
  const formattedMaskLeft = formatMask(maskLeft?.value || "");
  const formattedMaskRight = formatMask(maskRight?.value || "");

  const handleLeftChange = (text: string) => {
    // For special plates (except diplomatic), the left input should not be editable
    if (isSpecialPlate) {
      return;
    }

    onLeftChange(text.toUpperCase());

    // If the letters input is filled completely, focus on the numbers input
    if (text.replace(/\s/g, "").length === (maskLeft?.value || "").replace(/\s/g, "").length) {
      rightInputRef.current?.focus();
    }
  };

  const handleRightChange = (text: string) => {
    onRightChange(text.toUpperCase());
  };

  const handleRightKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // If backspace is pressed and the numbers field is empty, focus on the letters input
    if (e.nativeEvent.key === "Backspace" && right.length === 0) {
      leftInputRef.current?.focus();
    }
  };

  return {
    leftInputRef,
    rightInputRef,
    formattedMaskLeft,
    formattedMaskRight,
    handleLeftChange,
    handleRightChange,
    handleRightKeyPress,
  };
}
