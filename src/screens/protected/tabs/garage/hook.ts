import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useDeleteVehicle, useGetMyVehicles, useUpdateVehicle } from "@/services/api/vehicles";

export function useGarageTab() {
  const router = useRouter();

  // Query vehicles data
  const { data: vehicles = [], isLoading, error } = useGetMyVehicles();

  // Mutations
  const updateVehicleMutation = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const findVehicle = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId);
  };

  const handleAddVehicle = () => {
    router.push("/vehicle/create");
  };

  const handleVehiclePress = (vehicleId: string) => {
    const vehicle = findVehicle(vehicleId);

    if (!vehicle) return;

    const pending = vehicle.phase === "pending";

    if (pending) {
      router.push(`/vehicle/update/license-plate?id=${vehicleId}`);
    } else {
      router.push(`/vehicle/update?id=${vehicleId}`);
    }
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
