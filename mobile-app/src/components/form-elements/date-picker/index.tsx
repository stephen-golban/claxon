import { withController } from "../controller-hoc";
import BaseDatePicker from "./base-date-picker";

const DatePickerField = withController(BaseDatePicker);

export { DatePickerField, BaseDatePicker };
