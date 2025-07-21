import type React from "react";
import { View } from "react-native";
import type { LicensePlateType } from "@/lib/constants";

interface IPlateFrame extends React.PropsWithChildren {
  type: LicensePlateType;
  compact?: boolean;
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

export const PlateFrame: React.FC<IPlateFrame> = ({ children, type, compact }) => {
  const backgroundColor = getBgColor(type);
  const heightClass = compact ? "h-10" : "h-16"; // 40px vs 64px
  const borderWidth = compact ? "border-[3px]" : "border-[5px]";
  const borderRadius = compact ? "rounded-lg" : "rounded-xl";

  return (
    <View
      className={`overflow-hidden ${heightClass} ${borderRadius} ${borderWidth} border-black flex-row`}
      style={{ backgroundColor }}
    >
      {children}
    </View>
  );
};

PlateFrame.displayName = "PlateFrame";
