import { Text } from "@/components/ui/text";
import type { LicensePlateType } from "@/lib/constants";
import React from "react";
import { StyleSheet, type TextInput, View } from "react-native";

import { MaskedTextInput, type MaskedTextInputProps } from "react-native-mask-text";

interface IPlateInputBox extends MaskedTextInputProps {
  type: LicensePlateType;
  side: "left" | "right";
  disabled?: boolean;
  nonEditableText?: string;
  removePaddingLeft?: boolean;
}

const getInputConfig = (type: LicensePlateType, isLeft: boolean) => {
  switch (type) {
    case "cars.standard.default":
    case "cars.standard.old_four":
    case "cars.standard.public_transport":
      return { paddingLeft: 0, textAlign: isLeft ? "left" : "center", className: "mr-2", color: "black" };
    case "cars.standard.capital_c":
    case "cars.standard.neutral":
    case "cars.standard.capital_k":
      return { paddingLeft: 0, textAlign: isLeft ? "center" : "center", className: "mr-0", color: "black" };
    case "cars.special.diplomatic":
      return { paddingLeft: isLeft ? 0 : 20, textAlign: "left", className: "mr-1", color: "#214492" };
    case "cars.regional.transnistria":
      return { paddingLeft: 0, textAlign: isLeft ? "right" : "center", className: "mr-0", color: "black" };
    case "cars.special.temporary":
    case "cars.special.transit":
      return { paddingLeft: 0, textAlign: isLeft ? "left" : "center", className: "mr-2", color: "red" };

    default:
      return { paddingLeft: 0, textAlign: isLeft ? "left" : "center", className: "mr-2", color: "black" };
  }
};

export const PlateInputBox = React.forwardRef<TextInput, IPlateInputBox>((props, ref) => {
  const { mask, type, value, disabled, nonEditableText, side, removePaddingLeft = true, ...rest } = props;

  // Ensure mask is a valid string and calculate maxLength safely
  const safeMask = mask || "";
  const maxLength = safeMask.length;
  const safeValue = value || "";

  const isLeft = side === "left";

  const config = getInputConfig(type, isLeft);
  const color = config.color;
  const placeholderTextColor = type === "cars.standard.public_transport" ? "rgba(0,0,0,0.2)" : "lightgray";

  // For special plates (except diplomatic) on the left side, show only non-editable text
  const isSpecialPlateLeft = type.includes("cars.special") && type !== "cars.special.diplomatic" && side === "left";

  return (
    <View className="flex-1 flex-row items-center">
      {isSpecialPlateLeft ? (
        <Text style={[styles.input, { lineHeight: 45, color }]} className={config.className}>
          {nonEditableText}
        </Text>
      ) : (
        <>
          {nonEditableText && (
            <Text style={[styles.input, { lineHeight: 45, color }]} className={config.className}>
              {nonEditableText}
            </Text>
          )}
          <MaskedTextInput
            ref={ref}
            mask={safeMask}
            value={safeValue}
            autoComplete="off"
            autoCorrect={false}
            maxLength={maxLength}
            spellCheck={false}
            autoCapitalize="characters"
            editable={!disabled}
            placeholderTextColor={placeholderTextColor}
            textAlign={config.textAlign as "left" | "center" | "right"}
            selectionColor={color}
            style={[
              styles.input,
              {
                color,
                paddingLeft: config.paddingLeft,
                flex: type === "cars.special.diplomatic" ? undefined : 1,
              },
            ]}
            {...rest}
          />
        </>
      )}
    </View>
  );
});

PlateInputBox.displayName = "PlateInputBox";

const styles = StyleSheet.create({
  input: {
    fontSize: 35,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
