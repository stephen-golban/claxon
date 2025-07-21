import type React from "react";
import { View } from "react-native";
import { CarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const EmptyState: React.FC<{ onAddVehicle: () => void }> = ({ onAddVehicle }) => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="items-center mb-8">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <CarIcon size={40} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-bold text-foreground mb-2 text-center">No vehicles yet</Text>
      <Text className="text-base text-muted-foreground text-center leading-6">
        Add your first vehicle to get started with Claxon and manage your car communications
      </Text>
    </View>
    <Button onPress={onAddVehicle} className="rounded-2xl px-8" size="lg">
      <Text className="font-semibold">Add Your First Vehicle</Text>
    </Button>
  </View>
);

export default EmptyState;
