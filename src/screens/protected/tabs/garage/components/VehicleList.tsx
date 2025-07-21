import React from "react";
import { FlatList, View } from "react-native";
import type { Vehicle } from "@/services/api/vehicles";
import { VehicleCard, type VehicleCardProps } from "./VehicleCard";

/**
 * Props interface for VehicleList component
 */
export interface VehicleListProps {
  vehicles: Vehicle[];
  isVehicleLoading: (vehicleId: string) => boolean;
  onVehiclePress: (vehicleId: string) => void;
  onToggleActive: (vehicleId: string) => void;
  onDelete: (vehicleId: string) => void;
}

/**
 * VehicleList component following Single Responsibility Principle
 * Only responsible for rendering the list of vehicles
 * Optimized with React.memo and proper keyExtractor
 */
export const VehicleList = React.memo<VehicleListProps>(({
  vehicles,
  isVehicleLoading,
  onVehiclePress,
  onToggleActive,
  onDelete,
}) => {
  const renderVehicle = React.useCallback(
    ({ item }: { item: Vehicle }) => (
      <VehicleCard
        vehicle={item}
        isLoading={isVehicleLoading(item.id)}
        onPress={onVehiclePress}
        onToggleActive={onToggleActive}
        onDelete={onDelete}
      />
    ),
    [isVehicleLoading, onVehiclePress, onToggleActive, onDelete]
  );

  const keyExtractor = React.useCallback((item: Vehicle) => item.id, []);

  return (
    <View className="flex-1">
      <FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
});

VehicleList.displayName = "VehicleList";
