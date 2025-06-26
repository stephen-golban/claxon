import React from "react";
import { View } from "react-native";

export const PlateHoles = () => {
	return (
		<View className="flex-col items-center justify-center gap-y-2">
			<View className="shadow-inner h-2.5 w-2.5 rounded-full border border-gray-300 bg-gray-300" />
			<View className="shadow-inner h-4 w-4 rounded-full border border-gray-300" />
		</View>
	);
};

PlateHoles.displayName = "PlateHoles";
