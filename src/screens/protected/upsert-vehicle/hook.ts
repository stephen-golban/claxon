import { useRouter } from "expo-router";
import { useCreateVehicle } from "@/services/api/vehicles";
import type { UpsertVehicleFormData } from "./form/schema";

export default function useUpsertVehicleScreen() {
  const router = useRouter();
  const createVehicle = useCreateVehicle();

  const onSubmit = async (dto: UpsertVehicleFormData) => {
    if (createVehicle.isPending) return;

    const vehicle = await createVehicle.mutateAsync(
      { ...dto, phase: "pending" },
      {
        onSuccess: () => {
          router.push({
            pathname: "/upsert-license-plate",
            params: { vehicleId: vehicle.id },
          });
        },
      },
    );
  };

  return {
    onSubmit,
    error: createVehicle.error,
  };
}
