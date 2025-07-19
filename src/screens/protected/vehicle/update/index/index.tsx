import { isEmpty } from "lodash";
import { Container, KeyboardAware } from "@/components/common";
import VehicleForm from "@/components/forms/vehicle";
import type { Vehicle } from "@/services/api/vehicles";
import useUpdateVehicleScreen from "./hook";

interface IUpdateVehicleScreen {
  id: string;
  data?: Vehicle;
  loading?: boolean;
}

export default function UpdateVehicleScreen({ data, loading, id }: IUpdateVehicleScreen) {
  const { onSubmit } = useUpdateVehicleScreen(id);

  const isEmptyState = !data || isEmpty(data);

  return (
    <Container loading={loading} isEmpty={isEmptyState}>
      <KeyboardAware>
        <Container.TopText title="Update Vehicle" subtitle="Update your vehicle details" />
        <VehicleForm onSubmit={onSubmit} initialData={data} />
      </KeyboardAware>
    </Container>
  );
}
