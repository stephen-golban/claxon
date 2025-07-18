import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useDeleteVehicle, useGetMyVehicles, useUpdateVehicle } from "@/services/api/vehicles";

export function useMyCarsTab() {
  const router = useRouter();

  // Query vehicles data
  const { data: vehicles = [], isLoading, error } = useGetMyVehicles();

  // Mutations
  const updateVehicleMutation = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const handleAddVehicle = () => {
    router.push("/(protected)/vehicle/create");
  };

  const handleVehiclePress = (vehicleId: string) => {
    // Navigate to vehicle details or edit
    router.push(`/(protected)/vehicle/${vehicleId}`);
  };

  const handleToggleActive = async (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    await updateVehicleMutation.mutateAsync({
      id: vehicleId,
      dto: { is_active: !vehicle.is_active },
    });
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    Alert.alert("Delete Vehicle", `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteVehicleMutation.mutateAsync(vehicleId);
        },
      },
    ]);
  };

  return {
    // Data
    vehicles,

    // Loading states
    isLoading,
    error,
    isUpdating: updateVehicleMutation.isPending,
    isDeleting: deleteVehicleMutation.isPending,

    // Handlers
    handleAddVehicle,
    handleVehiclePress,
    handleToggleActive,
    handleDeleteVehicle,
  };
}
