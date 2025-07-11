import type React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { LicensePlateType } from "@/lib/constants";

interface IPlateFlagWrapper extends React.PropsWithChildren {
	type: LicensePlateType;
}

export const PlateFlagWrapper: React.FC<IPlateFlagWrapper> = ({
	type,
	children,
}) => {
	switch (type) {
		case "cars.standard.old_four":
			return (
				<View className="h-full w-[10%] items-center bg-[#0028a1] py-1">
					{children}
					<Text className="text-white text-xs mt-1">MD</Text>
				</View>
			);

		case "cars.standard.capital_c":
		case "cars.standard.capital_k":
			return (
				<View className="h-full w-[10%] border-r-2 border-black items-center justify-center">
					{children}
					<Text className="text-black mt-1 text-xs">MD</Text>
				</View>
			);

		case "cars.regional.transnistria":
			return <View className="flex h-full w-1/12">{children}</View>;

		case "cars.standard.neutral":
			return (
				<View className="h-full w-1/12 items-center py-1.5">
					{children}
					<Text className="text-transparent mt-2">MD</Text>
				</View>
			);
		default:
			return (
				<View className="h-full w-[15%] items-center justify-center bg-[#02359a] pt-1.5">
					{children}
					<Text className="text-white font-semibold text-sm mt-1">MD</Text>
				</View>
			);
	}
};

PlateFlagWrapper.displayName = "PlateFlagWrapper";
