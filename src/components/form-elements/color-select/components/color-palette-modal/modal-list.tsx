import React from "react";
import type { ListRenderItem } from "react-native";
import { FlatList } from "react-native";

import { VEHICLE_COLORS } from "@/lib/constants";
import type { VehicleColor } from "../../types";
import ModalListItem from "./modal-list-item";

// Unique key extractor for FlashList
const keyExtractor = (item: VehicleColor) => item.code;

interface IModalList {
	selectedColorIndex: number;
	onColorSelect: (index: number) => void;
}

const DATA_WITH_PLACEHOLDER = [
	...VEHICLE_COLORS,
	{ code: "placeholder", description: "Placeholder", rgba: null },
];

const ModalList: React.FC<IModalList> = ({
	onColorSelect,
	selectedColorIndex,
}) => {
	const renderItem: ListRenderItem<VehicleColor> = React.useCallback(
		({ item, index }) => {
			return (
				<ModalListItem
					item={item}
					onPress={() => onColorSelect(index)}
					isSelected={selectedColorIndex === index}
				/>
			);
		},
		[onColorSelect, selectedColorIndex],
	);

	return (
		<FlatList
			data={DATA_WITH_PLACEHOLDER as VehicleColor[]}
			className="flex-1 p-6"
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			extraData={selectedColorIndex}
			contentContainerClassName="gap-y-4 gap-x-4 flex-row flex-wrap justify-between pb-4"
		/>
	);
};

export default ModalList;
