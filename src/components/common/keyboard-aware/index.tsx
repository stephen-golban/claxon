import { KeyboardAwareScrollView, type KeyboardAwareScrollViewProps } from "react-native-keyboard-controller";
import { cn } from "@/lib/utils";

interface KeyboardAwareProps extends KeyboardAwareScrollViewProps {}

export function KeyboardAware({ children, className, contentContainerClassName, ...props }: KeyboardAwareProps) {
  return (
    <KeyboardAwareScrollView
      {...props}
      bottomOffset={200}
      className={cn("flex-1", className)}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName={cn("flex-grow", contentContainerClassName)}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
