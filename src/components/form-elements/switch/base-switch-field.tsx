import type React from "react";
import { View } from "react-native";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useErrorMessageTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { FieldError } from "../field-error";

interface BaseSwitchFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur: () => void;
  error?: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

const BaseSwitchField: React.FC<BaseSwitchFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  description,
  className,
  disabled = false,
}) => {
  const errorMessage = useErrorMessageTranslation(error);

  return (
    <View className={cn("gap-y-2", className)}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          {label && <Text className={cn("font-medium text-foreground", disabled && "opacity-50")}>{label}</Text>}
          {description && (
            <Text className={cn("text-sm text-muted-foreground", disabled && "opacity-50")}>{description}</Text>
          )}
        </View>
        <Switch checked={value} onCheckedChange={onChange} onBlur={onBlur} disabled={disabled} />
      </View>
      {errorMessage && <FieldError message={errorMessage} />}
    </View>
  );
};

export default BaseSwitchField;
