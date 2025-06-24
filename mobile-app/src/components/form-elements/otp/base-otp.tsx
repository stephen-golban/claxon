import React from "react";

import { useColorScheme, useErrorMessageTranslation } from "@/hooks";

import { OtpInput, type OtpInputProps } from "react-native-otp-entry";
import { FieldError } from "../field-error";

export interface BaseOtpFieldProps extends Pick<OtpInputProps, "onFocus"> {
  value: string;
  // biome-ignore lint/suspicious/noExplicitAny: any is used to allow for any type of event
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  error?: string;
  onFilled?: () => void;
}

const BaseOtpField = React.forwardRef<React.ComponentRef<typeof OtpInput>, BaseOtpFieldProps>(
  ({ value, onChange, onBlur, error, onFilled, ...rest }, ref) => {
    const { isDark } = useColorScheme();
    const errorMessage = useErrorMessageTranslation(error);

    return (
      <>
        <OtpInput
          ref={ref}
          type="numeric"
          onTextChange={onChange}
          onBlur={onBlur}
          onFilled={() => onFilled?.()}
          focusColor={error ? "#ef4444" : isDark ? "white" : "black"}
          theme={{
            containerStyle: { columnGap: 10 },
            pinCodeContainerStyle: {
              flex: 1,
              borderColor: error ? "#ef4444" : isDark ? "white" : "black",
            },
            pinCodeTextStyle: { color: error ? "#ef4444" : isDark ? "white" : "black" },
          }}
          numberOfDigits={6}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          {...rest}
        />
        {errorMessage && <FieldError message={errorMessage} className="mt-4" />}
      </>
    );
  },
);

BaseOtpField.displayName = "BaseOtpField";

export default BaseOtpField;
