import type { VehicleColor } from "../../types";

/**
 * Props for the ColorPreview component
 */
export interface ColorPreviewProps {
	/** Index of the currently selected color */
	selectedColorIndex: number;
	/** Available color options */
	colorOptions?: VehicleColor[];
	/** Callback for selecting the next color */
	onNextColor: () => void;
	/** Callback for selecting the previous color */
	onPreviousColor: () => void;
	/** Callback for opening the color palette */
	onOpenPalette: () => void;
	/** Placeholder text when no color is selected */
	placeholder?: string;
	/** Whether the control has an error */
	error?: boolean;
	/** Whether the control is disabled */
	disabled?: boolean;
}
