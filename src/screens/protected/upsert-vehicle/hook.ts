import { useRouter } from "expo-router";
import { useCreateVehicle } from "@/services/api/vehicles";
import type { UpsertVehicleFormData } from "./form/schema";

export default function useUpsertVehicleScreen() {
  const router = useRouter();
  const createVehicle = useCreateVehicle();

  const onSubmit = async (dto: UpsertVehicleFormData) => {
    if (createVehicle.isPending) return;

    await createVehicle.mutateAsync(
      { ...dto, phase: "pending" },
      {
        onSuccess: ({ id }) => {
          router.push({
            pathname: "/vehicle/license-plate/[id]",
            params: { id },
          });
        },
      },
    );
  };

  return {
    onSubmit,
  };
}
