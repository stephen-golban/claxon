import { useGetMyVehicles } from "@/services/api/vehicles";
import { useHapticFeedback } from "./hooks/useHapticFeedback";
import { usePerVehicleLoadingState } from "./hooks/usePerVehicleLoadingState";
import { useVehicleOperations } from "./hooks/useVehicleOperations";

/**
 * Main hook for garage tab following Dependency Inversion Principle
 * Orchestrates smaller, focused hooks and provides a clean interface
 */
export function useGarageTab() {
  // Data fetching
  const { data: vehicles = [], isLoading, error } = useGetMyVehicles();

  // Focused hooks following Single Responsibility Principle
  const haptics = useHapticFeedback();
  const loadingState = usePerVehicleLoadingState();
  const vehicleOperations = useVehicleOperations({
    vehicles,
    haptics,
    loadingState,
  });

  return {
    // Data
    vehicles,
    isLoading,
    error,

    // Per-vehicle loading state (fixes the global loading issue)
    isVehicleLoading: loadingState.isLoading,

    // Operations
    handleAddVehicle: vehicleOperations.addVehicle,
    handleVehiclePress: vehicleOperations.navigateToVehicle,
    handleToggleActive: vehicleOperations.toggleActive,
    handleDeleteVehicle: vehicleOperations.deleteVehicle,
  };
}
