import { View } from "react-native";
import { Container, ErrorScreen } from "@/components/common";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import EmptyState from "./empty-state";
import useGarageTab from "./hook";
import VehicleList from "./vehicle-list";

export function GarageTab() {
  const {
    vehicles,
    isLoading,
    error,
    isVehicleDeleteLoading,
    handleAddVehicle,
    handleEditLicensePlate,
    handleEditVehicleDetails,
    handleDeleteVehicle,
  } = useGarageTab();

  if (error) {
    return <ErrorScreen message="Failed to load vehicles" />;
  }

  return (
    <Container loading={isLoading}>
      <View className="flex-1">
        <Container.TopText title="My Cars" subtitle="Manage your registered vehicles (max 5)" />

        {/* Add vehicle button */}
        <View className="mb-6">
          <Button
            onPress={handleAddVehicle}
            className="rounded-full flex-row items-center gap-2"
            size="lg"
            disabled={vehicles.length >= 5}
          >
            <PlusIcon className="text-primary-foreground" />
            <Text>Add New Vehicle</Text>
          </Button>
        </View>

        {/* Vehicle list or empty state */}
        <View className="flex-1">
          {vehicles.length === 0 ? (
            <EmptyState onAddVehicle={handleAddVehicle} />
          ) : (
            <VehicleList
              vehicles={vehicles}
              isVehicleDeleteLoading={isVehicleDeleteLoading}
              onEditLicensePlate={handleEditLicensePlate}
              onEditVehicleDetails={handleEditVehicleDetails}
              onDelete={handleDeleteVehicle}
            />
          )}
        </View>
      </View>
    </Container>
  );
}
