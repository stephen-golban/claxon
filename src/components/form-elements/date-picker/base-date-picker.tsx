import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { View } from "react-native";
import { BottomSheet, BottomSheetContent, BottomSheetView, useBottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useErrorMessageTranslation, useTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { FieldError } from "../field-error";

interface IBaseDatePicker {
	value: Date;
	error?: string;
	onChange: (date: Date) => void;
	onBlur?: () => void;
	onFocus?: () => void;
	label?: string;
}

const BaseDatePicker: React.FC<IBaseDatePicker> = ({ value = new Date(), error, onChange, onBlur, onFocus, label }) => {
	const { t } = useTranslation();
	const errorMessage = useErrorMessageTranslation(error);
	const { ref: bottomSheetRef, open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();

	const handlePresentModalPress = React.useCallback(() => {
		openBottomSheet();
		onFocus?.();
	}, [openBottomSheet, onFocus]);

	const handleDismiss = React.useCallback(() => {
		closeBottomSheet();
		onBlur?.();
	}, [closeBottomSheet, onBlur]);

	return (
		<View>
			{label && (
				<Text className="text-lg font-medium text-foreground">
					{label} <Text className="text-destructive">*</Text>
				</Text>
			)}
			<Button
				size="lg"
				onPress={handlePresentModalPress}
				className={cn(
					"bg-transparent-black dark:bg-transparent-white rounded-2xl flex-row px-4 justify-start",
					error && "border-2 border-destructive",
				)}
			>
				<Text className={cn("native:text-lg text-foreground", error && "text-destructive")}>
					{value?.toLocaleDateString()}
				</Text>
			</Button>

			<BottomSheet>
				<BottomSheetContent ref={bottomSheetRef} snapPoints={["50%"]} enablePanDownToClose>
					<BottomSheetView>
						<Text className="text-xl font-bold text-center pb-6">{t("labels:dob")}</Text>
						<View className="items-center justify-center">
							<DateTimePicker
								mode="date"
								value={value}
								display="spinner"
								onChange={(_, selectedDate) => {
									if (selectedDate) {
										onChange(selectedDate);
									}
								}}
							/>
						</View>
						<View className="mt-6">
							<Button size="lg" onPress={handleDismiss} className="rounded-full">
								<Text>{t("buttons:confirm")}</Text>
							</Button>
						</View>
					</BottomSheetView>
				</BottomSheetContent>
			</BottomSheet>
			{errorMessage && <FieldError message={errorMessage} />}
		</View>
	);
};

export default BaseDatePicker;
