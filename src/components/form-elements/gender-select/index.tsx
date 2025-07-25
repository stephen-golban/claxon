import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { withController } from "../controller-hoc";
import BaseGenderSelect, { type BaseGenderSelectProps } from "./base-gender-select";

interface GenderSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseGenderSelectProps, "value" | "onChange" | "onBlur" | "error"> {
  control: Control<TFieldValues>;
  name: TName;
}

const GenderSelectField = withController(BaseGenderSelect);

export { GenderSelectField };
export type { GenderSelectFieldProps };
