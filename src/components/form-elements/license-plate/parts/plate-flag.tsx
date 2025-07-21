import type React from "react";
import { View } from "react-native";
import { MDFlag, MoldovaStema, TransnistriaFlag } from "@/components/icons/flags";
import type { LicensePlateType } from "@/lib/constants";

interface IPlateFlag {
  type: LicensePlateType;
  compact?: boolean;
}

export const PlateFlag: React.FC<IPlateFlag> = ({ type, compact }) => {
  // Scale dimensions based on compact prop
  const moldovaStemaSize = compact ? { width: 40, height: 40 } : { width: 60, height: 60 };
  const transnistriaFlagSize = compact ? { width: 25, height: 14 } : { width: 35, height: 20 };
  const mdFlagSize = compact ? { width: 18, height: 8 } : { width: 25, height: 12 };
  const heightClass = compact ? "h-[12px]" : "h-[20px]";
  const heightClassNeutral = compact ? "h-[15px]" : "h-[25px]";
  const margin = compact ? "m-0.5 mt-1" : "m-1 mt-2";
  switch (type) {
    case "cars.standard.old_four":
    case "cars.standard.capital_c":
    case "cars.standard.capital_k":
      return (
        <View className={`${heightClass} items-center justify-center`}>
          <MoldovaStema {...moldovaStemaSize} />
        </View>
      );

    case "cars.regional.transnistria":
      return (
        <View className={margin}>
          <TransnistriaFlag {...transnistriaFlagSize} />
        </View>
      );

    case "cars.standard.neutral":
      return (
        <View className={`${heightClassNeutral} items-center justify-center`}>
          <View style={{ width: 100, height: 100 }} />
        </View>
      );

    default:
      return (
        <View className="border border-white">
          <MDFlag {...mdFlagSize} />
        </View>
      );
  }
};
PlateFlag.displayName = "PlateFlag";
