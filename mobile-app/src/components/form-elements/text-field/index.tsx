import { withController } from "../controller-hoc";
import BaseTextField, { type BaseTextFieldProps } from "./base-text-field";

const TextField = withController(BaseTextField);

export { TextField, BaseTextField, type BaseTextFieldProps };
