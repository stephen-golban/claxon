import { withController } from "../controller-hoc";
import BaseColorSelectField from "./base-color-select-field";

const ColorSelectField = withController(BaseColorSelectField);

export { ColorSelectField, BaseColorSelectField };
export type { BaseColorSelectFieldProps } from "./base-color-select-field";
