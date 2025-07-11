import { Eye, EyeOff } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { useColorScheme, useErrorMessageTranslation, useTranslation } from "@/hooks";
import { FieldError } from "../field-error";
import BaseTextField, { type BaseTextFieldProps } from "../text-field/base-text-field";

export interface BasePasswordFieldProps extends Omit<BaseTextFieldProps, "secureTextEntry"> {}

const BasePasswordField = React.forwardRef<React.ComponentRef<typeof BaseTextField>, BasePasswordFieldProps>(
  ({ value, onChange, onBlur, error, ...props }, ref) => {
    const { isDark } = useColorScheme();
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const Icon = showPassword ? Eye : EyeOff;

    const { t } = useTranslation();
    const errorMessage = useErrorMessageTranslation(error);

    return (
      <>
        <View className="w-full flex flex-row items-center relative">
          <BaseTextField
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            secureTextEntry={!showPassword}
            placeholder={t("placeholders:password")}
            autoComplete="password"
            textContentType="password"
            autoCapitalize="none"
            spellCheck={false}
            autoCorrect={false}
            hideErrorMessage
            returnKeyType="done"
            className="flex-1"
            rightElement={
              <Pressable onPress={togglePasswordVisibility}>
                <Icon size={20} color={error ? "rgb(242, 62, 48)" : isDark ? "#e5e7eb" : "#1f2937"} />
              </Pressable>
            }
            enablesReturnKeyAutomatically
            {...props}
          />
        </View>
        {errorMessage && <FieldError message={errorMessage} />}
      </>
    );
  },
);

BasePasswordField.displayName = "BasePasswordField";

export default BasePasswordField;
