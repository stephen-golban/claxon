import { useLocalSearchParams, useRouter } from "expo-router";
import { useUpdateVehicle } from "@/services/api/vehicles";
import type { UpsertLicensePlateFormData } from "./form/schema";

export default function useUpsertLicensePlateScreen() {
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const updateVehicle = useUpdateVehicle();

  const onSubmit = async (dto: UpsertLicensePlateFormData) => {
    if (updateVehicle.isPending || !vehicleId) return;

    await updateVehicle.mutateAsync(
      {
        id: vehicleId,
        dto: {
          plate_type: dto.plate_type,
          plate_left_part: dto.plate.left,
          plate_right_part: dto.plate.right,
          plate_number: `${dto.plate.left}${dto.plate.right}`, // Combined plate number
          plate_country: "MD", // Default to Moldova
          phase: "done", // Mark vehicle setup as completed
          is_active: true,
        },
      },
      {
        onSuccess: () => {
          // Navigate back to the vehicles list or main screen
          router.replace("/(protected)/tabs/my-cars");
        },
      },
    );
  };

  return {
    onSubmit,
    vehicleId,
    error: updateVehicle.error,
  };
}
