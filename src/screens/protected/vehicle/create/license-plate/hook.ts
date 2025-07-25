import { useRouter } from "expo-router";
import type { LicensePlateFormData } from "@/components/forms/license-plate";
import { useUpdateVehicle } from "@/services/api/vehicles";

export default function useCreateLicensePlateScreen(id: string) {
  const router = useRouter();
  const updateVehicle = useUpdateVehicle();

  const onSubmit = async (dto: LicensePlateFormData) => {
    if (updateVehicle.isPending || !id) return;

    await updateVehicle.mutateAsync(
      {
        id,
        dto: {
          plate_type: dto.type,
          plate_left_part: dto.plate.left,
          plate_right_part: dto.plate.right,
          plate_number: `${dto.plate.left}${dto.plate.right}`, // Combined plate number
          plate_country: "MD", // Default to Moldova
          phase: "done", // Mark vehicle setup as completed
        },
      },
      {
        onSuccess: () => {
          // Navigate back to the vehicles list or main screen
          router.replace("/tabs/garage");
        },
      },
    );
  };

  return {
    onSubmit,
  };
}
