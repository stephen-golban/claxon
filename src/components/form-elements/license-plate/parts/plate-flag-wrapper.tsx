import type React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { LicensePlateType } from "@/lib/constants";

interface IPlateFlagWrapper extends React.PropsWithChildren {
  type: LicensePlateType;
  compact?: boolean;
}

export const PlateFlagWrapper: React.FC<IPlateFlagWrapper> = ({ type, children, compact }) => {
  const textSize = compact ? "text-[8px]" : "text-xs";
  const textSizeLarge = compact ? "text-[10px]" : "text-sm";
  const padding = compact ? "py-0.5" : "py-1";
  const paddingTop = compact ? "pt-0.5" : "pt-1.5";
  const marginTop = compact ? "mt-0.5" : "mt-1";
  switch (type) {
    case "cars.standard.old_four":
      return (
        <View className={`h-full w-[10%] items-center bg-[#0028a1] ${padding}`}>
          {children}
          <Text className={`text-white ${textSize} ${marginTop}`}>MD</Text>
        </View>
      );

    case "cars.standard.capital_c":
    case "cars.standard.capital_k":
      return (
        <View className="h-full w-[10%] border-r-2 border-black items-center justify-center">
          {children}
          <Text className={`text-black ${marginTop} ${textSize}`}>MD</Text>
        </View>
      );

    case "cars.regional.transnistria":
      return <View className="flex h-full w-1/12">{children}</View>;

    case "cars.standard.neutral":
      return (
        <View className={`h-full w-1/12 items-center ${padding}`}>
          {children}
          <Text className={`text-transparent mt-2`}>MD</Text>
        </View>
      );
    default:
      return (
        <View className={`h-full w-[15%] items-center justify-center bg-[#02359a] ${paddingTop}`}>
          {children}
          <Text className={`text-white font-semibold ${textSizeLarge} ${marginTop}`}>MD</Text>
        </View>
      );
  }
};

PlateFlagWrapper.displayName = "PlateFlagWrapper";
