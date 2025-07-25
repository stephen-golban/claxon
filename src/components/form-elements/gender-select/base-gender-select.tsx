import * as Haptics from "expo-haptics";
import type React from "react";
import { useCallback } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useErrorMessageTranslation, useTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { FieldError } from "../field-error";

export interface BaseGenderSelectProps {
  label?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
}

const BaseGenderSelect: React.FC<BaseGenderSelectProps> = ({
  label,
  hideLabel,
  disabled,
  value,
  onChange,
  onBlur,
  error,
  className,
}) => {
  const { t } = useTranslation();
  const errorMessage = useErrorMessageTranslation(error);

  const handleGenderSelect = useCallback(
    (selectedGender: string) => {
      if (disabled) return;

      // Haptic feedback for selection
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      onChange(selectedGender);
      onBlur?.();
    },
    [disabled, onChange, onBlur],
  );

  const genderOptions = [
    { value: "male", label: t("options:gender:male") },
    { value: "female", label: t("options:gender:female") },
  ];

  return (
    <View className={cn("w-full gap-y-3", className)}>
      {!hideLabel && label && (
        <Text className="text-xl font-medium text-foreground">
          {label} <Text className="text-destructive">*</Text>
        </Text>
      )}

      <View className="flex-row gap-3">
        {genderOptions.map((option) => {
          const isSelected = value === option.value;

          return (
            <Button
              key={option.value}
              variant={isSelected ? "default" : "outline"}
              size="default"
              className={cn(
                "flex-1 h-14 rounded-2xl",
                disabled && "opacity-60",
                isSelected && "bg-primary",
                !isSelected && "bg-transparent-black dark:bg-transparent-white border-input",
              )}
              onPress={() => handleGenderSelect(option.value)}
              disabled={disabled}
            >
              <Text className={cn("text-lg font-medium", isSelected ? "text-primary-foreground" : "text-foreground")}>
                {option.label}
              </Text>
            </Button>
          );
        })}
      </View>

      {errorMessage && <FieldError message={errorMessage} />}
    </View>
  );
};

export default BaseGenderSelect;
