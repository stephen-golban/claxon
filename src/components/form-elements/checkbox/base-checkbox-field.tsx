import type React from "react";
import { Pressable, View } from "react-native";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { FieldError } from "../field-error";

interface BaseCheckboxFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur: () => void;
  error?: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const BaseCheckboxField: React.FC<BaseCheckboxFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  children,
  className,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <View className={cn("gap-y-2", className)}>
      <Pressable onPress={handlePress} onBlur={onBlur} className="flex-row items-start gap-x-3" disabled={disabled}>
        <Checkbox checked={value} onCheckedChange={() => {}} disabled={disabled} className="mt-1" />
        <View className="flex-1">
          {label && <Text className={cn("text-foreground", disabled && "opacity-50")}>{label}</Text>}
          {children}
        </View>
      </Pressable>
      {error && <FieldError message={error} />}
    </View>
  );
};

export default BaseCheckboxField;
