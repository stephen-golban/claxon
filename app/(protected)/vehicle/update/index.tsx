import { useLocalSearchParams } from "expo-router";
import UpdateVehicleScreen from "@/screens/protected/vehicle/update/index";
import { useGetVehicleById } from "@/services/api/vehicles";

export default function UpdateVehicle() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const vehicle = useGetVehicleById(id);

  const isLoading = vehicle.isLoading || vehicle.isPending;

  return <UpdateVehicleScreen id={id} data={vehicle.data} loading={isLoading} />;
}
