import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useDeleteVehicle, useGetMyVehicles } from "@/services/api/vehicles";

/**
 * Main hook for garage tab following the simplified account pattern
 * Consolidates all vehicle operations, loading states, and haptic feedback
 */
export default function useGarageTab() {
  const router = useRouter();

  // Data fetching
  const { data: vehicles = [], isLoading, error } = useGetMyVehicles();

  // Mutations
  const deleteVehicleMutation = useDeleteVehicle();

  // Per-vehicle delete loading state
  const [deleteLoadingStates, setDeleteLoadingStates] = useState<Record<string, boolean>>({});

  // Loading state management
  const setVehicleDeleteLoading = useCallback((vehicleId: string, loading: boolean) => {
    setDeleteLoadingStates((prev) => ({
      ...prev,
      [vehicleId]: loading,
    }));
  }, []);

  const isVehicleDeleteLoading = useCallback(
    (vehicleId: string): boolean => {
      return deleteLoadingStates[vehicleId] || false;
    },
    [deleteLoadingStates],
  );

  // Haptic feedback functions
  const hapticLight = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const hapticSuccess = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Helper function to find vehicle
  const findVehicle = useCallback(
    (vehicleId: string) => {
      return vehicles.find((v) => v.id === vehicleId);
    },
    [vehicles],
  );

  // Vehicle operations
  const handleAddVehicle = useCallback(() => {
    hapticLight();
    router.push("/vehicle/create");
  }, [hapticLight, router]);

  const handleEditLicensePlate = useCallback(
    (vehicleId: string) => {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      hapticLight();
      router.push(`/vehicle/update/license-plate?id=${vehicleId}`);
    },
    [findVehicle, hapticLight, router],
  );

  const handleEditVehicleDetails = useCallback(
    (vehicleId: string) => {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      hapticLight();
      router.push(`/vehicle/update?id=${vehicleId}`);
    },
    [findVehicle, hapticLight, router],
  );

  const handleDeleteVehicle = useCallback(
    async (vehicleId: string) => {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      try {
        setVehicleDeleteLoading(vehicleId, true);
        hapticSuccess();
        await deleteVehicleMutation.mutateAsync(vehicleId);
      } finally {
        setVehicleDeleteLoading(vehicleId, false);
      }
    },
    [findVehicle, hapticSuccess, setVehicleDeleteLoading, deleteVehicleMutation],
  );

  return {
    // Data
    vehicles,
    isLoading,
    error,

    // Loading state function
    isVehicleDeleteLoading,

    // Operations
    handleAddVehicle,
    handleEditLicensePlate,
    handleEditVehicleDetails,
    handleDeleteVehicle,
  };
}
