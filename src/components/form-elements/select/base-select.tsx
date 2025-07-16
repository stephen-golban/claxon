import React from "react";
import { ScrollView, View } from "react-native";
import { type Option, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useErrorMessageTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { FieldError } from "../field-error";

export interface BaseSelectFieldProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

const BaseSelectField = React.forwardRef<React.ComponentRef<typeof Select>, BaseSelectFieldProps>(
  ({ label, options, placeholder, hideLabel, disabled, value, onChange, onBlur, error, ...props }, ref) => {
    const [inputWidth, setInputWidth] = React.useState(0);
    const errorMessage = useErrorMessageTranslation(error);

    const handleChange = (option: Option) => {
      if (typeof option === "object" && option !== null) {
        onChange(option.value);
      } else if (typeof option === "string") {
        onChange(option);
      }
    };

    return (
      <View className="w-full gap-y-3" onLayout={(event) => setInputWidth(event.nativeEvent.layout.width)}>
        {!hideLabel && label && (
          <Text className="text-xl font-medium text-foreground">
            {label} <Text className="text-destructive">*</Text>
          </Text>
        )}

        <Select
          ref={ref}
          value={
            value
              ? {
                  value: value,
                  label: options.find((opt) => opt?.value === value)?.label || "",
                }
              : undefined
          }
          onValueChange={handleChange}
          disabled={disabled}
          {...props}
        >
          <SelectTrigger
            onBlur={onBlur}
            className={cn(
              "native:h-14 bg-transparent-black dark:bg-transparent-white rounded-2xl",
              disabled && "opacity-60",
            )}
          >
            <SelectValue
              placeholder={placeholder || ""}
              className={cn("text-lg", placeholder && !value ? "text-muted-foreground" : "text-foreground")}
            />
          </SelectTrigger>

          <SelectContent
            sideOffset={8}
            className="overflow-hidden rounded-2xl border-transparent p-0 shadow-none bg-background"
            style={{ width: inputWidth }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option, idx) => (
                <SelectItem
                  key={option?.value}
                  value={option?.value || ""}
                  label={option?.label || ""}
                  style={{
                    borderTopRightRadius: idx === 0 ? 16 : 0,
                    borderTopLeftRadius: idx === 0 ? 16 : 0,
                    borderBottomRightRadius: idx === options.length - 1 ? 16 : 0,
                    borderBottomLeftRadius: idx === options.length - 1 ? 16 : 0,
                  }}
                  className="bg-transparent-black active:bg-transparent-black dark:bg-transparent-white text-foreground dark:active:bg-transparent-white"
                >
                  {option?.label || ""}
                </SelectItem>
              ))}
            </ScrollView>
          </SelectContent>
        </Select>

        {errorMessage && <FieldError message={errorMessage} />}
      </View>
    );
  },
);

BaseSelectField.displayName = "BaseSelectField";

export default BaseSelectField;
