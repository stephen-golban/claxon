import React from "react";
import { FlatList, View } from "react-native";
import type { Vehicle } from "@/services/api/vehicles";
import type { OperationType } from "./hook";
import VehicleCard from "./vehicle-card";

const VehicleList = React.memo<{
  vehicles: Vehicle[];
  isVehicleLoading: (vehicleId: string, operation?: OperationType) => boolean;
  onEditLicensePlate: (vehicleId: string) => void;
  onEditVehicleDetails: (vehicleId: string) => void;
  onToggleActive: (vehicleId: string) => void;
  onDelete: (vehicleId: string) => void;
}>(({ vehicles, isVehicleLoading, onEditLicensePlate, onEditVehicleDetails, onToggleActive, onDelete }) => {
  const renderVehicle = React.useCallback(
    ({ item }: { item: Vehicle }) => (
      <VehicleCard
        vehicle={item}
        isToggleLoading={isVehicleLoading(item.id, "toggle")}
        isDeleteLoading={isVehicleLoading(item.id, "delete")}
        onEditLicensePlate={onEditLicensePlate}
        onEditVehicleDetails={onEditVehicleDetails}
        onToggleActive={onToggleActive}
        onDelete={onDelete}
      />
    ),
    [isVehicleLoading, onEditLicensePlate, onEditVehicleDetails, onToggleActive, onDelete],
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

export default VehicleList;
