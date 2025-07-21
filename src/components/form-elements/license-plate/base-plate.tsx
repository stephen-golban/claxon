import { View } from "react-native";
import { cn } from "@/lib/utils";
import useBasePlate from "./hook";
import { PlateFlag, PlateFlagWrapper, PlateFrame, PlateHoles, PlateInputBox } from "./parts";
import type { BaseRenderPlateProps } from "./type";

export const BasePlate: React.FC<BaseRenderPlateProps> = (props) => {
  const hook = useBasePlate(props);

  return (
    <PlateFrame type={props.type} compact={props.compact}>
      <PlateFlagWrapper type={props.type} compact={props.compact}>
        <PlateFlag type={props.type} compact={props.compact} />
      </PlateFlagWrapper>
      <View
        className={cn("flex-1 flex-row px-8 justify-center", {
          "px-10": props.type === "cars.standard.neutral",
        })}
      >
        <PlateInputBox
          side="left"
          type={props.type}
          value={props.left}
          autoFocus={false}
          ref={hook.leftInputRef}
          mask={hook.formattedMaskLeft}
          placeholder={props.maskLeft?.value}
          onChangeText={hook.handleLeftChange}
          nonEditableText={props.maskLeft?.nonEditableText}
          disabled={props.disabled || (props.type.includes("cars.special") && props.type !== "cars.special.diplomatic")}
          compact={props.compact}
        />

        {(props.type === "cars.standard.default" || props.type === "cars.standard.public_transport") && (
          <PlateHoles compact={props.compact} />
        )}
        <PlateInputBox
          type={props.type}
          autoFocus={false}
          value={props.right}
          ref={hook.rightInputRef}
          disabled={props.disabled}
          mask={hook.formattedMaskRight}
          placeholder={props.maskRight?.value}
          onChangeText={hook.handleRightChange}
          onKeyPress={hook.handleRightKeyPress}
          side="right"
          compact={props.compact}
        />
      </View>
    </PlateFrame>
  );
};
