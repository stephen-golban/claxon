import { withController } from "../controller-hoc";
import BaseColorSelectField from "./base-color-select";

const ColorSelectField = withController(BaseColorSelectField);

export { ColorSelectField, BaseColorSelectField };

export { ColorBottomSheet } from "./color-bottom-sheet";
export { ColorField } from "./color-field";
// Export individual components for potential reuse
export { ColorOption } from "./color-option";
export * from "./hook";
// Export types
export type * from "./types";
// Export utilities
export * from "./util";
