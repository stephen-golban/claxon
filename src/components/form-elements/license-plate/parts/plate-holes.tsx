import { View } from "react-native";

interface IPlateHoles {
  compact?: boolean;
}

export const PlateHoles: React.FC<IPlateHoles> = ({ compact }) => {
  const smallHoleSize = compact ? "h-1.5 w-1.5" : "h-2.5 w-2.5";
  const largeHoleSize = compact ? "h-2.5 w-2.5" : "h-4 w-4";
  const gapSize = compact ? "gap-y-1" : "gap-y-2";

  return (
    <View className={`flex-col items-center justify-center ${gapSize}`}>
      <View className={`shadow-inner ${smallHoleSize} rounded-full border border-gray-300 bg-gray-300`} />
      <View className={`shadow-inner ${largeHoleSize} rounded-full border border-gray-300`} />
    </View>
  );
};

PlateHoles.displayName = "PlateHoles";
