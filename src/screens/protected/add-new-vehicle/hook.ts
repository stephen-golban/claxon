import { useRouter } from "expo-router";
import { useCreateVehicle } from "@/services/api/vehicles";
import type { AddVehicleFormData } from "./form/schema";

export default function useAddNewVehicleScreen() {
  const router = useRouter();
  const createVehicle = useCreateVehicle();

  const onSubmit = async (dto: AddVehicleFormData) => {
    if (createVehicle.isPending) return;

    try {
      await createVehicle.mutateAsync(
        {
          brand: dto.brand,
          model: dto.model,
          manufacture_year: dto.manufacture_year,
          color: dto.color,
          vin_code: dto.vin_code,
        },
        {
          onSuccess: () => {
            // Navigate back to my-cars tab
            router.dismissTo("/(protected)/tabs/my-cars");
          },
        },
      );
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Failed to create vehicle:", error);
    }
  };

  return {
    onSubmit,
    isSubmitting: createVehicle.isPending,
    error: createVehicle.error,
  };
}
