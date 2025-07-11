import React from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useErrorMessageTranslation, useTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { FieldError } from "../field-error";
import BaseTextField, { type BaseTextFieldProps } from "../text-field/base-text-field";
import { usePhoneInput } from "./hook";

export interface BasePhoneFieldProps extends BaseTextFieldProps {
  hideLabel?: boolean;
  disabled?: boolean;
}

const BasePhoneField = React.forwardRef<React.ComponentRef<typeof BaseTextField>, BasePhoneFieldProps>(
  ({ onChange, error, hideLabel, disabled, ...props }, ref) => {
    const { t } = useTranslation();
    const { formatPhoneNumber } = usePhoneInput();
    const errorMessage = useErrorMessageTranslation(error);

    const handleChange = (text: string) => {
      const formatted = formatPhoneNumber(text);
      onChange(formatted);
    };

    return (
      <View className="w-full gap-y-3">
        {!hideLabel && (
          <Text className="text-lg font-medium text-foreground">
            {t("labels:phone")} <Text className="text-destructive">*</Text>
          </Text>
        )}
        <View className={cn("w-full flex-row items-center justify-between", disabled && "opacity-60")}>
          {/* Country code container */}
          <Button
            size="lg"
            className={cn(
              "pointer-events-none mr-3 flex-row rounded-2xl border border-transparent bg-transparent-black px-4 dark:bg-transparent-white",
              error && "bg-destructive/10 text-destructive dark:bg-destructive/10",
            )}
          >
            <Text className="native:text-base">🇲🇩</Text>
            <Text className={cn("native:text-lg ml-2 text-gray-800 dark:text-gray-200", error && "text-destructive")}>
              +373
            </Text>
          </Button>

          {/* Phone input container */}
          <BaseTextField
            ref={ref}
            error={error}
            maxLength={11} // 8 digits + 2 spaces
            inputMode="tel"
            hideErrorMessage
            autoComplete="tel"
            className="flex-1"
            autoCorrect={false}
            returnKeyType="done"
            editable={!disabled}
            autoCapitalize="none"
            onChange={handleChange}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            placeholder={t("placeholders:phone")}
            {...props}
          />
        </View>
        {errorMessage && <FieldError message={errorMessage} />}
      </View>
    );
  },
);

BasePhoneField.displayName = "BasePhoneField";

export default BasePhoneField;
