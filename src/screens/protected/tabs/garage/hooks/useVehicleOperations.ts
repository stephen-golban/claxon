import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useCallback } from "react";
import { useDeleteVehicle, useUpdateVehicleActiveState, type Vehicle } from "@/services/api/vehicles";
import type { HapticFeedback } from "./useHapticFeedback";
import type { PerVehicleLoadingState } from "./usePerVehicleLoadingState";

/**
 * Custom hook for vehicle operations following Single Responsibility Principle
 * Handles all vehicle-related operations with proper loading state management
 */

export interface VehicleOperations {
  toggleActive: (vehicleId: string) => Promise<void>;
  deleteVehicle: (vehicleId: string) => void;
  navigateToVehicle: (vehicleId: string) => void;
  addVehicle: () => void;
}

interface UseVehicleOperationsProps {
  vehicles: Vehicle[];
  haptics: HapticFeedback;
  loadingState: PerVehicleLoadingState;
}

export const useVehicleOperations = ({
  vehicles,
  haptics,
  loadingState,
}: UseVehicleOperationsProps): VehicleOperations => {
  const router = useRouter();
  const updateVehicleActiveStateMutation = useUpdateVehicleActiveState();
  const deleteVehicleMutation = useDeleteVehicle();

  const findVehicle = useCallback(
    (vehicleId: string) => {
      return vehicles.find((v) => v.id === vehicleId);
    },
    [vehicles]
  );

  const toggleActive = useCallback(
    async (vehicleId: string) => {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      try {
        loadingState.setLoading(vehicleId, true);
        haptics.medium();

        await updateVehicleActiveStateMutation.mutateAsync({
          id: vehicleId,
          isActive: !vehicle.is_active,
        });
      } finally {
        loadingState.setLoading(vehicleId, false);
      }
    },
    [findVehicle, loadingState, haptics, updateVehicleActiveStateMutation]
  );

  const deleteVehicle = useCallback(
    (vehicleId: string) => {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      haptics.heavy();

      Alert.alert("Delete Vehicle", `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => haptics.light(),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              loadingState.setLoading(vehicleId, true);
              haptics.success();
              await deleteVehicleMutation.mutateAsync(vehicleId);
            } finally {
              loadingState.setLoading(vehicleId, false);
            }
          },
        },
      ]);
    },
    [findVehicle, haptics, loadingState, deleteVehicleMutation]
  );

  const navigateToVehicle = useCallback(
    (vehicleId: string) => {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      haptics.light();

      const pending = vehicle.phase === "pending";

      if (pending) {
        router.push(`/vehicle/update/license-plate?id=${vehicleId}`);
      } else {
        router.push(`/vehicle/update?id=${vehicleId}`);
      }
    },
    [findVehicle, haptics, router]
  );

  const addVehicle = useCallback(() => {
    haptics.light();
    router.push("/vehicle/create");
  }, [haptics, router]);

  return {
    toggleActive,
    deleteVehicle,
    navigateToVehicle,
    addVehicle,
  };
};
