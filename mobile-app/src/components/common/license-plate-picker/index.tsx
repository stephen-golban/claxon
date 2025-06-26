import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import type React from "react";
import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { BottomSheet, BottomSheetContent, useBottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { LICENSE_PLATE_TYPES, type LicensePlateType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { usePlateSections } from "./hook";
import type { ILicensePlatePicker, PlateItem, PlateSection } from "./type";

const LicensePlatePicker: React.FC<ILicensePlatePicker> = ({ children, onTypeChange, type }) => {
	const { t } = useTranslation();
	const { ref: bottomSheetRef, open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();
	const sections = usePlateSections(type);

	const getCurrentPlateImage = useCallback(() => {
		const [category, subcategory, plateType] = type.split(".");

		if (category === "cars") {
			if (subcategory === "standard") {
				return LICENSE_PLATE_TYPES.cars.standard[plateType as keyof typeof LICENSE_PLATE_TYPES.cars.standard]?.image;
			}
			if (subcategory === "regional") {
				return LICENSE_PLATE_TYPES.cars.regional[plateType as keyof typeof LICENSE_PLATE_TYPES.cars.regional]?.image;
			}
			if (subcategory === "special") {
				return LICENSE_PLATE_TYPES.cars.special[plateType as keyof typeof LICENSE_PLATE_TYPES.cars.special]?.image;
			}
		}

		// Fallback to default plate image
		return LICENSE_PLATE_TYPES.cars.standard.default.image;
	}, [type]);

	const handleOpenBottomSheet = useCallback(() => {
		openBottomSheet();
	}, [openBottomSheet]);

	const handleDismiss = useCallback(() => {
		closeBottomSheet();
	}, [closeBottomSheet]);

	const handlePlateSelect = useCallback(
		(plateType: LicensePlateType) => {
			onTypeChange(plateType);
			handleDismiss();
		},
		[onTypeChange, handleDismiss],
	);

	const formatTitle = useCallback((key: string) => {
		return key
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}, []);

	const renderPlateItem = useCallback(
		({ item }: { item: PlateItem }) => (
			<TouchableOpacity
				onPress={() => handlePlateSelect(item.value)}
				className={cn(
					"flex-row items-center p-4 mx-4 mb-3 rounded-xl border-2 bg-card",
					item.isSelected ? "border-primary bg-primary/5" : "border-border",
				)}
				activeOpacity={0.7}
			>
				<View className="flex-1 flex-row items-center">
					<Image source={item.image} contentFit="contain" style={{ width: 80, height: 48, marginRight: 16 }} />
					<View className="flex-1">
						<Text className={cn("text-base font-semibold", item.isSelected ? "text-primary" : "text-foreground")}>
							{formatTitle(item.key)}
						</Text>
					</View>
				</View>
				{item.isSelected && (
					<View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
						<View className="w-2 h-2 rounded-full bg-primary-foreground" />
					</View>
				)}
			</TouchableOpacity>
		),
		[handlePlateSelect, formatTitle],
	);

	const renderSectionHeader = useCallback(
		({ section }: { section: PlateSection }) => (
			<View className="px-4 py-3 bg-muted/30">
				<Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{section.title}</Text>
			</View>
		),
		[],
	);

	const renderSectionSeparator = useCallback(() => <View className="h-4" />, []);

	return (
		<>
			<View className="flex-row items-center gap-x-2">
				<View className="flex-1">{children}</View>
				<Button size="icon" className={cn("!h-16 !w-16 rounded-xl")} variant="outline" onPress={handleOpenBottomSheet}>
					<Image source={getCurrentPlateImage()} contentFit="contain" style={{ width: 32, height: 20 }} />
				</Button>
			</View>
			<BottomSheet>
				<BottomSheetContent ref={bottomSheetRef} snapPoints={["80%"]} enablePanDownToClose>
					<View className="px-4 pb-4 border-b border-border">
						<Text className="text-xl font-bold text-center">Choose Plate Type</Text>
						<Text className="text-sm text-muted-foreground text-center mt-1">
							Select the license plate format that matches your vehicle
						</Text>
					</View>

					<BottomSheetSectionList
						sections={sections}
						keyExtractor={(item) => item.value}
						renderItem={renderPlateItem}
						renderSectionHeader={renderSectionHeader}
						SectionSeparatorComponent={renderSectionSeparator}
						showsVerticalScrollIndicator={false}
						className="flex-1"
						contentContainerStyle={{ paddingVertical: 16, paddingBottom: 120 }}
						stickySectionHeadersEnabled={false}
					/>
				</BottomSheetContent>
			</BottomSheet>
		</>
	);
};

export { LicensePlatePicker };
