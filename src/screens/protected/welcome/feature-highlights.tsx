import type React from "react";
import { View } from "react-native";
import { BellIcon, CarIcon, SearchIcon } from "@/components/icons";
import { Text } from "@/components/ui/text";

interface FeatureHighlightsProps {
  title?: string;
}

const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({ title = "What you can do with Claxon" }) => {
  const features = [
    {
      id: "search",
      icon: <SearchIcon size={16} className="text-green-600 dark:text-green-400" />,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      description: "Search any license plate and send instant claxons",
    },
    {
      id: "notifications",
      icon: <BellIcon size={16} className="text-blue-600 dark:text-blue-400" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      description: "Receive notifications when someone claxons your car",
    },
    {
      id: "manage",
      icon: <CarIcon size={16} className="text-purple-600 dark:text-purple-400" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      description: "Manage multiple vehicles and customize your profile",
    },
  ];

  return (
    <View className="mt-8 mb-4 px-4">
      <Text className="text-lg font-semibold mb-4 text-foreground">{title}</Text>

      <View className="gap-3">
        {features.map((feature) => (
          <View key={feature.id} className="flex-row items-center gap-3 p-4 bg-muted/20 rounded-xl">
            <View className={`w-8 h-8 ${feature.iconBg} rounded-full items-center justify-center`}>{feature.icon}</View>
            <Text className="text-sm text-muted-foreground flex-1">{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export { FeatureHighlights };
