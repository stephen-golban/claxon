import React from "react";
import { View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useColorScheme, useErrorMessageTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { FieldError } from "../field-error";

interface ExtendedInputProps extends Omit<React.ComponentProps<typeof Input>, "onChangeText"> {
  error?: string;
  value: string;
  hasErrorSpace?: boolean;
  hideErrorMessage?: boolean;
  rightElement?: React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: any is used to allow for any type of event
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  label?: string;
}

const BaseTextField = React.forwardRef<React.ComponentRef<typeof Input>, ExtendedInputProps>((props, ref) => {
  const { error, value, onChange, className, rightElement, hasErrorSpace, hideErrorMessage, label, ...rest } = props;
  const { isDark } = useColorScheme();
  const errorMessage = useErrorMessageTranslation(error);

  const isNumeric = props.keyboardType === "numeric";

  const handleChangeText = (text: string) => {
    const input = isNumeric ? Number.parseInt(text || "0", 10) : text;
    onChange?.(input);
  };

  const preparedValue = React.useMemo(() => {
    if (isNumeric) {
      return value.toString();
    }
    return value;
  }, [isNumeric, value]);

  return (
    <>
      {label && (
        <Text className="text-lg font-medium text-foreground">
          {label} <Text className="text-destructive">*</Text>
        </Text>
      )}
      <Input
        ref={ref as React.RefObject<React.ComponentRef<typeof Input>>}
        value={preparedValue}
        onChangeText={handleChangeText}
        selectionColor={error ? "rgb(242, 62, 48)" : isDark ? "white" : "black"}
        className={cn(
          "native:h-14 native:text-lg native:leading-[1.25] rounded-2xl border border-transparent bg-transparent-black px-4 text-black dark:bg-transparent-white dark:text-white",
          rightElement && "pr-10",
          error && "bg-destructive/10 text-destructive dark:bg-destructive/10",
          className,
        )}
        autoFocus={false}
        {...rest}
      />
      {rightElement && <View className="absolute right-3 flex items-center justify-center">{rightElement}</View>}
      {!hideErrorMessage && (
        <View className={cn(hasErrorSpace && "min-h-5")}>{errorMessage && <FieldError message={errorMessage} />}</View>
      )}
    </>
  );
});

BaseTextField.displayName = "BaseTextField";

export default BaseTextField;

export type BaseTextFieldProps = React.ComponentProps<typeof BaseTextField>;
