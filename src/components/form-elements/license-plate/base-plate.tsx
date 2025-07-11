import { View } from "react-native";
import { cn } from "@/lib/utils";
import useBasePlate from "./hook";
import {
	PlateFlag,
	PlateFlagWrapper,
	PlateFrame,
	PlateHoles,
	PlateInputBox,
} from "./parts";
import type { BaseRenderPlateProps } from "./type";

export const BasePlate: React.FC<BaseRenderPlateProps> = (props) => {
	const hook = useBasePlate(props);

	const shouldAlignLeftSideCenter =
		props.type === "cars.standard.capital_c" ||
		props.type === "cars.standard.capital_k";

	return (
		<PlateFrame type={props.type}>
			<PlateFlagWrapper type={props.type}>
				<PlateFlag type={props.type} />
			</PlateFlagWrapper>
			<View
				className={cn("flex-1 flex-row px-8 justify-center", {
					"px-10": props.type === "cars.standard.neutral",
				})}
			>
				<PlateInputBox
					type={props.type}
					value={props.left}
					ref={hook.leftInputRef}
					disabled={
						props.disabled ||
						(props.type.includes("cars.special") &&
							props.type !== "cars.special.diplomatic")
					}
					mask={hook.formattedMaskLeft}
					autoFocus={
						!(
							props.type.includes("cars.special") &&
							props.type !== "cars.special.diplomatic"
						)
					}
					placeholder={props.maskLeft?.value}
					onChangeText={hook.handleLeftChange}
					nonEditableText={props.maskLeft?.nonEditableText}
					side="left"
				/>

				{(props.type === "cars.standard.default" ||
					props.type === "cars.standard.public_transport") && <PlateHoles />}
				<PlateInputBox
					type={props.type}
					value={props.right}
					ref={hook.rightInputRef}
					disabled={props.disabled}
					mask={hook.formattedMaskRight}
					autoFocus={
						props.type.includes("cars.special") &&
						props.type !== "cars.special.diplomatic"
					}
					placeholder={props.maskRight?.value}
					onChangeText={hook.handleRightChange}
					onKeyPress={hook.handleRightKeyPress}
					side="right"
				/>
			</View>
		</PlateFrame>
	);
};
