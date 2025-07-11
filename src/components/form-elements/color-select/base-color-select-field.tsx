import React from "react";
import { View } from "react-native";

import { FieldError } from "@/components/form-elements/field-error";
import { Text } from "@/components/ui/text";
import { VEHICLE_COLORS } from "@/lib/constants";
import { ColorPaletteModal, ColorPreview } from "./components";

/**
 * Base component for color selection that works with the withController HOC
 */
export interface BaseColorSelectFieldProps {
	/** Label text for the input field */
	label?: string;
	/** Currently selected color code */
	value: string;
	/** Error message to display if validation fails */
	error?: string;
	/** Placeholder text for when no value is selected */
	placeholder?: string;
	/** Whether to hide the label */
	hideLabel?: boolean;
	/** Whether the input is disabled */
	disabled?: boolean;
	/** Callback when the selected color changes */
	// biome-ignore lint/suspicious/noExplicitAny: we need to pass the event to the parent
	onChange: (...event: any[]) => void;
	/** Callback when the input loses focus */
	onBlur: () => void;
	/** Callback when the input gains focus */
	onFocus?: () => void;
}

const BaseColorSelectField = React.forwardRef<View, BaseColorSelectFieldProps>(
	(
		{
			label,
			value,
			error,
			onChange,
			placeholder,
			hideLabel = false,
			disabled = false,
			onBlur,
			onFocus,
		},
		ref,
	) => {
		// Find the color index based on the value prop
		const getColorIndexFromValue = (val: string) => {
			if (!val) return 0;
			const index = VEHICLE_COLORS.findIndex((color) => color.code === val);
			return index >= 0 ? index : 0;
		};

		// Keep track of the current index in UI state
		const [selectedColorIndex, setSelectedColorIndex] = React.useState<number>(
			getColorIndexFromValue(value),
		);

		const [isModalVisible, setIsModalVisible] = React.useState(false);

		// Sync UI when value changes from parent
		// biome-ignore lint/correctness/useExhaustiveDependencies: we need to sync the UI when the value changes
		React.useEffect(() => {
			setSelectedColorIndex(getColorIndexFromValue(value));
		}, [value]);

		// Color navigation handlers
		const handleNextColor = () => {
			if (selectedColorIndex < VEHICLE_COLORS.length - 1) {
				const nextIndex = selectedColorIndex + 1;
				// Update local UI state
				setSelectedColorIndex(nextIndex);
				// Directly update parent
				onChange(VEHICLE_COLORS[nextIndex].code);
			}
		};

		const handlePreviousColor = () => {
			if (selectedColorIndex > 0) {
				const prevIndex = selectedColorIndex - 1;
				// Update local UI state
				setSelectedColorIndex(prevIndex);
				// Directly update parent
				onChange(VEHICLE_COLORS[prevIndex].code);
			}
		};

		// Handle selection from the grid modal
		const handleColorSelect = (index: number) => {
			// Update local UI state
			setSelectedColorIndex(index);
			// Directly update parent
			onChange(VEHICLE_COLORS[index].code);
			setIsModalVisible(false);
			onBlur();
		};

		// Open the full color palette modal
		const handleOpenPalette = () => {
			if (disabled) return;
			onFocus?.();
			setIsModalVisible(true);
		};

		return (
			<View ref={ref as React.RefObject<View>} className="w-full">
				{/* Input Label */}
				{!hideLabel && label && (
					<Text className="mb-2 text-xl font-medium text-dark dark:text-light">
						{label} <Text className="text-destructive">*</Text>
					</Text>
				)}

				{/* Color Preview with Navigation */}
				<ColorPreview
					error={!!error}
					disabled={disabled}
					placeholder={placeholder}
					onNextColor={handleNextColor}
					onOpenPalette={handleOpenPalette}
					onPreviousColor={handlePreviousColor}
					selectedColorIndex={selectedColorIndex}
				/>

				{/* Error Message */}
				{error && <FieldError message={error} className="mt-2" />}

				{/* Color Palette Modal */}
				<ColorPaletteModal
					isVisible={isModalVisible}
					onColorSelect={handleColorSelect}
					selectedColorIndex={selectedColorIndex}
					onClose={() => {
						setIsModalVisible(false);
						onBlur();
					}}
				/>
			</View>
		);
	},
);

BaseColorSelectField.displayName = "BaseColorSelectField";

export default BaseColorSelectField;
