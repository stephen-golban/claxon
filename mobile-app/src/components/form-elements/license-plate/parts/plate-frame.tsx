import type React from "react";
import { View } from "react-native";
import type { LicensePlateType } from "@/lib/constants";

interface IPlateFrame extends React.PropsWithChildren {
	type: LicensePlateType;
}
const COLORS = {
	white: "white",
	yellow: "#e3991b",
	lightgray: "#f2f2f2",
};

const getBgColor = (type: LicensePlateType) => {
	switch (type) {
		case "cars.standard.public_transport":
			return COLORS.yellow;
		case "cars.standard.neutral":
		case "cars.standard.capital_c":
		case "cars.standard.capital_k":
		case "cars.standard.old_four":
		case "cars.regional.transnistria":
			return COLORS.lightgray;

		default:
			return COLORS.white;
	}
};

export const PlateFrame: React.FC<IPlateFrame> = ({ children, type }) => {
	const backgroundColor = getBgColor(type);

	return (
		<View className="overflow-hidden h-16 rounded-xl border-[5px] border-black flex-row" style={{ backgroundColor }}>
			{children}
		</View>
	);
};

PlateFrame.displayName = "PlateFrame";
