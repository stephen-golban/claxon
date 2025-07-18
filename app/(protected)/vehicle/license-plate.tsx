import { useLocalSearchParams } from "expo-router";
import { ErrorScreen, FullScreenLoader } from "@/components/common";
import { useTranslation } from "@/hooks";
import UpsertLicensePlateScreen from "@/screens/protected/upsert-license-plate";
import { useGetVehicleById } from "@/services/api/vehicles";

export default function LicensePlateById() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const vehicle = useGetVehicleById(id);

  if (vehicle.isError || !vehicle.data) {
    return <ErrorScreen message={t("vehicleDetails:errorMessage")} />;
  }

  if (vehicle.isLoading || vehicle.isPending) {
    return <FullScreenLoader />;
  }

  return <UpsertLicensePlateScreen data={vehicle.data} />;
}
