import React from "react";
import { FlatList, View } from "react-native";
import type { Vehicle } from "@/services/api/vehicles";
import VehicleCard from "./vehicle-card";

interface VehicleListProps {
  vehicles: Vehicle[];
  isVehicleDeleteLoading: (vehicleId: string) => boolean;
  onEditLicensePlate: (vehicleId: string) => void;
  onEditVehicleDetails: (vehicleId: string) => void;
  onDelete: (vehicleId: string) => void;
}
const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  isVehicleDeleteLoading,
  onEditLicensePlate,
  onEditVehicleDetails,
  onDelete,
}) => {
  const renderVehicle = React.useCallback(
    ({ item }: { item: Vehicle }) => (
      <VehicleCard
        vehicle={item}
        isDeleteLoading={isVehicleDeleteLoading(item.id)}
        onEditLicensePlate={onEditLicensePlate}
        onEditVehicleDetails={onEditVehicleDetails}
        onDelete={onDelete}
      />
    ),
    [isVehicleDeleteLoading, onEditLicensePlate, onEditVehicleDetails, onDelete],
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
};

export default React.memo(VehicleList);
