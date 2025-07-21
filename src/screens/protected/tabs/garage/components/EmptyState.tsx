import React from "react";
import { View } from "react-native";
import { CarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

/**
 * Props interface for EmptyState component
 */
export interface EmptyStateProps {
  onAddVehicle: () => void;
}

/**
 * EmptyState component following Single Responsibility Principle
 * Only responsible for displaying the empty state when no vehicles exist
 * Optimized with React.memo
 */
export const EmptyState = React.memo<EmptyStateProps>(({ onAddVehicle }) => {
  return (
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
});

EmptyState.displayName = "EmptyState";
