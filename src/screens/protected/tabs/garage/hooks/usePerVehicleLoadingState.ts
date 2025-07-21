import { useCallback, useState } from "react";

/**
 * Custom hook for managing per-vehicle loading states
 * Solves the issue where global loading state affects all vehicle cards
 */

export interface PerVehicleLoadingState {
  isLoading: (vehicleId: string) => boolean;
  setLoading: (vehicleId: string, loading: boolean) => void;
  clearAllLoading: () => void;
}

export const usePerVehicleLoadingState = (): PerVehicleLoadingState => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((vehicleId: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [vehicleId]: loading,
    }));
  }, []);

  const isLoading = useCallback(
    (vehicleId: string): boolean => {
      return loadingStates[vehicleId] || false;
    },
    [loadingStates]
  );

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    isLoading,
    setLoading,
    clearAllLoading,
  };
};
