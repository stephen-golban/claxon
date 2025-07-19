import { useLocalSearchParams } from "expo-router";
import UpdateLicensePlateScreen from "@/screens/protected/vehicle/update/license-plate";
import { useGetVehicleById } from "@/services/api/vehicles";

export default function UpdateLicensePlate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = useGetVehicleById(id);

  const isLoading = vehicle.isLoading || vehicle.isPending;

  return <UpdateLicensePlateScreen id={id} data={vehicle.data} loading={isLoading} />;
}
