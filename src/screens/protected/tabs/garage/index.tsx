import { View } from "react-native";
import { Container, ErrorScreen } from "@/components/common";
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
    isVehicleLoading,
    handleAddVehicle,
    handleEditLicensePlate,
    handleEditVehicleDetails,
    handleToggleActive,
    handleDeleteVehicle,
  } = useGarageTab();

  if (error) {
    return <ErrorScreen message="Failed to load vehicles" />;
  }

  return (
    <Container loading={isLoading}>
      <View className="flex-1">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground mb-2">My Cars</Text>
          <Text className="text-base text-muted-foreground">Manage your registered vehicles</Text>
        </View>

        {/* Add vehicle button */}
        <View className="mb-6">
          <Button onPress={handleAddVehicle} className="rounded-2xl h-14" size="lg">
            <Text className="text-base font-semibold">Add New Vehicle</Text>
          </Button>
        </View>

        {/* Vehicle list or empty state */}
        <View className="flex-1">
          {vehicles.length === 0 ? (
            <EmptyState onAddVehicle={handleAddVehicle} />
          ) : (
            <VehicleList
              vehicles={vehicles}
              isVehicleLoading={isVehicleLoading}
              onEditLicensePlate={handleEditLicensePlate}
              onEditVehicleDetails={handleEditVehicleDetails}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteVehicle}
            />
          )}
        </View>
      </View>
    </Container>
  );
}
