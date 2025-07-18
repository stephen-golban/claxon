import { Redirect, useLocalSearchParams } from "expo-router";
import { ErrorScreen, FullScreenLoader } from "@/components/common";
import { useTranslation } from "@/hooks";
import UpsertVehicleScreen from "@/screens/protected/upsert-vehicle";
import { useGetVehicleById } from "@/services/api/vehicles";

export default function VehicleById() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const vehicle = useGetVehicleById(id);

  if (vehicle.isError || !vehicle.data) {
    return <ErrorScreen message={t("vehicleDetails:errorMessage")} />;
  }

  if (vehicle.isLoading || vehicle.isPending) {
    return <FullScreenLoader />;
  }

  if (vehicle.data?.phase === "pending") {
    return <Redirect href={`/vehicle/license-plate?id=${vehicle.data.id}`} />;
  }

  return <UpsertVehicleScreen data={vehicle.data} />;
}
