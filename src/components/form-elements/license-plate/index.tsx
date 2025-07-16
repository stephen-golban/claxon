import _ from "lodash";
import type React from "react";

import { LICENSE_PLATE_TYPES, type LicensePlateType } from "@/lib/constants";
import { BasePlate } from "./base-plate";
import type { BaseRenderPlateProps } from "./type";

/**
 * A component that renders the appropriate license plate based on the specified type.
 * This is the main entry point for using license plates in the application.
 */
const BaseLicensePlateField: React.FC<BaseRenderPlateProps> = ({ type, ...props }) => {
  const common = { type, ...props };

  const plate = _.get(LICENSE_PLATE_TYPES, type);

  return <BasePlate {...common} maskLeft={plate.maskLeft} maskRight={plate.maskRight} />;
};

/**
 * Form-compatible license plate field that works with React Hook Form
 * This component is designed to work with separate form fields for type, left, and right parts
 */
interface LicensePlateFormFieldProps {
  plateType: LicensePlateType;
  plateLeft: string;
  plateRight: string;
  onPlateTypeChange: (type: LicensePlateType) => void;
  onPlateLeftChange: (left: string) => void;
  onPlateRightChange: (right: string) => void;
  disabled?: boolean;
}

const LicensePlateFormField: React.FC<LicensePlateFormFieldProps> = ({
  plateType,
  plateLeft,
  plateRight,
  onPlateLeftChange,
  onPlateRightChange,
  disabled,
}) => {
  return (
    <BaseLicensePlateField
      type={plateType}
      left={plateLeft}
      right={plateRight}
      onLeftChange={onPlateLeftChange}
      onRightChange={onPlateRightChange}
      disabled={disabled}
    />
  );
};

BaseLicensePlateField.displayName = "BaseLicensePlateField";
LicensePlateFormField.displayName = "LicensePlateFormField";

// Export both the base component (for direct use) and form component (for React Hook Form)
export { BaseLicensePlateField as LicensePlateField, LicensePlateFormField };
