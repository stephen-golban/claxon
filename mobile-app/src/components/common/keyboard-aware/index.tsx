import React from "react";

import { cn } from "@/lib/utils";
import { KeyboardAwareScrollView, type KeyboardAwareScrollViewProps } from "react-native-keyboard-controller";

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
