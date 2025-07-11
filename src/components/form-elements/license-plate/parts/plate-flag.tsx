import type React from "react";
import { View } from "react-native";
import { MDFlag, MoldovaStema, TransnistriaFlag } from "@/components/icons/flags";
import type { LicensePlateType } from "@/lib/constants";

interface IPlateFlag {
  type: LicensePlateType;
}

export const PlateFlag: React.FC<IPlateFlag> = ({ type }) => {
  switch (type) {
    case "cars.standard.old_four":
    case "cars.standard.capital_c":
    case "cars.standard.capital_k":
      return (
        <View className="h-[20px] items-center justify-center">
          <MoldovaStema width={60} height={60} />
        </View>
      );

    case "cars.regional.transnistria":
      return (
        <View className="m-1 mt-2">
          <TransnistriaFlag width={35} height={20} />
        </View>
      );

    case "cars.standard.neutral":
      return (
        <View className="h-[25px] items-center justify-center">
          <View style={{ width: 100, height: 100 }} />
        </View>
      );

    default:
      return (
        <View className="border border-white">
          <MDFlag width={25} height={12} />
        </View>
      );
  }
};
PlateFlag.displayName = "PlateFlag";
