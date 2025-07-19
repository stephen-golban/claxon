import { useRouter } from "expo-router";
import type { VehicleFormData } from "@/components/forms/vehicle";
import { useUpdateVehicle } from "@/services/api/vehicles";

export default function useUpdateVehicleScreen(id: string) {
  const router = useRouter();
  const updateVehicle = useUpdateVehicle();

  const onSubmit = async (dto: VehicleFormData) => {
    if (updateVehicle.isPending) return;

    await updateVehicle.mutateAsync(
      { id, dto },
      {
        onSuccess: () => {
          router.replace(`/vehicle/update/license-plate?id=${id}`);
        },
      },
    );
  };

  return {
    onSubmit,
  };
}
