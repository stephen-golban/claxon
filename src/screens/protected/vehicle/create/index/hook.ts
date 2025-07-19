import { useRouter } from "expo-router";
import type { VehicleFormData } from "@/components/forms/vehicle";
import { useCreateVehicle } from "@/services/api/vehicles";

export default function useCreateVehicleScreen() {
  const router = useRouter();
  const createVehicle = useCreateVehicle();

  const onSubmit = async (dto: VehicleFormData) => {
    if (createVehicle.isPending) return;

    await createVehicle.mutateAsync(
      { ...dto, phase: "pending" },
      {
        onSuccess: ({ id }) => {
          router.replace(`/vehicle/create/license-plate?id=${id}`);
        },
      },
    );
  };

  return {
    onSubmit,
  };
}
