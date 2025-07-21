import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useDeleteVehicle, useGetMyVehicles, useUpdateVehicleActiveState } from "@/services/api/vehicles";

/**
 * Operation types for per-vehicle loading states
 */
export type OperationType = "toggle" | "delete";

/**
 * Edit types for vehicle navigation
 */
export type EditType = "license-plate" | "details";

/**
 * Main hook for garage tab following the simplified account pattern
 * Consolidates all vehicle operations, loading states, and haptic feedback
 */
export default function useGarageTab() {
  const router = useRouter();

  // Data fetching
  const { data: vehicles = [], isLoading, error } = useGetMyVehicles();

  // Mutations
  const updateVehicleActiveStateMutation = useUpdateVehicleActiveState();
  const deleteVehicleMutation = useDeleteVehicle();

  // Per-vehicle, per-operation loading state
  const [loadingStates, setLoadingStates] = useState<Record<string, Record<OperationType, boolean>>>({});

  // Loading state management
  const setVehicleLoading = useCallback((vehicleId: string, operation: OperationType, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        [operation]: loading,
      },
    }));
  }, []);

  const isVehicleLoading = useCallback(
    (vehicleId: string, operation?: OperationType): boolean => {
      if (!operation) {
        // If no operation specified, return true if ANY operation is loading
        return Object.values(loadingStates[vehicleId] || {}).some(Boolean);
      }
      return loadingStates[vehicleId]?.[operation] || false;
    },
    [loadingStates],
  );

  // Haptic feedback functions
  const hapticLight = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const hapticMedium = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const handleToggleActive = useCallback(
    async (vehicleId: string) => {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      try {
        setVehicleLoading(vehicleId, "toggle", true);
        hapticMedium();

        await updateVehicleActiveStateMutation.mutateAsync({
          id: vehicleId,
          isActive: !vehicle.is_active,
        });
      } finally {
        setVehicleLoading(vehicleId, "toggle", false);
      }
    },
    [findVehicle, setVehicleLoading, hapticMedium, updateVehicleActiveStateMutation],
  );

  const handleDeleteVehicle = useCallback(
    async (vehicleId: string) => {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      try {
        setVehicleLoading(vehicleId, "delete", true);
        hapticSuccess();
        await deleteVehicleMutation.mutateAsync(vehicleId);
      } finally {
        setVehicleLoading(vehicleId, "delete", false);
      }
    },
    [findVehicle, hapticSuccess, setVehicleLoading, deleteVehicleMutation],
  );

  return {
    // Data
    vehicles,
    isLoading,
    error,

    // Loading state function
    isVehicleLoading,

    // Operations
    handleAddVehicle,
    handleEditLicensePlate,
    handleEditVehicleDetails,
    handleToggleActive,
    handleDeleteVehicle,
  };
}
