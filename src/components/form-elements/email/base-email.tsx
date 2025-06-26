import React from "react";

import { useTranslation } from "@/hooks";

import { BaseTextField, type BaseTextFieldProps } from "../text-field";

export interface BaseEmailFieldProps extends BaseTextFieldProps {}

const BaseEmailField = React.forwardRef<React.ComponentRef<typeof BaseTextField>, BaseEmailFieldProps>((props, ref) => {
  const { t } = useTranslation();

  return (
    <BaseTextField
      ref={ref}
      autoComplete="email"
      autoCapitalize="none"
      keyboardType="email-address"
      placeholder={t("placeholders:email")}
      textContentType="emailAddress"
      inputMode="email"
      spellCheck={false}
      autoCorrect={false}
      returnKeyType="next"
      enablesReturnKeyAutomatically
      {...props}
    />
  );
});

BaseEmailField.displayName = "BaseEmailField";

export default BaseEmailField;
