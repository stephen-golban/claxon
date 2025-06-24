import { withController } from "../controller-hoc";
import BasePasswordField from "./base-password-field";

const PasswordField = withController(BasePasswordField);

export { PasswordField, BasePasswordField };
