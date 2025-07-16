import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useErrorMessageTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { FieldError } from "../field-error";
import { ColorBottomSheet } from "./color-bottom-sheet";
import { ColorField } from "./color-field";
import type { BaseColorSelectFieldProps } from "./types";
import { findColorByCode } from "./util";

const BaseColorSelectField = React.forwardRef<View, BaseColorSelectFieldProps>(
  ({ label, hideLabel, disabled, value, onChange, onBlur, error, className }, ref) => {
    const errorMessage = useErrorMessageTranslation(error);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);

    // Get current selected color
    const selectedColor = React.useMemo(() => {
      return findColorByCode(value);
    }, [value]);

    const handleColorChange = React.useCallback(
      (colorCode: string) => {
        onChange(colorCode);
        onBlur?.();
      },
      [onChange, onBlur],
    );

    const openBottomSheet = React.useCallback(() => {
      setIsBottomSheetOpen(true);
    }, []);

    const closeBottomSheet = React.useCallback(() => {
      setIsBottomSheetOpen(false);
    }, []);

    return (
      <>
        <View ref={ref} className={cn("w-full gap-y-3", className)}>
          {!hideLabel && label && (
            <Text className="text-lg font-medium text-foreground">
              {label} <Text className="text-destructive">*</Text>
            </Text>
          )}

          <ColorField
            value={value}
            onChange={handleColorChange}
            onOpenPicker={openBottomSheet}
            disabled={disabled}
            selectedColor={selectedColor}
            className={cn(errorMessage && "border-destructive")}
          />

          {errorMessage && <FieldError message={errorMessage} />}
        </View>

        <ColorBottomSheet
          value={value}
          onChange={handleColorChange}
          onClose={closeBottomSheet}
          selectedColor={selectedColor}
          disabled={disabled}
          isOpen={isBottomSheetOpen}
        />
      </>
    );
  },
);

BaseColorSelectField.displayName = "BaseColorSelectField";

export default BaseColorSelectField;
