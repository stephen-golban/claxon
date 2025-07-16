import { Container, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";
import type { Vehicle } from "@/services/api/vehicles";
import UpsertVehicleForm from "./form";
import useUpsertVehicleScreen from "./hook";

interface IUpsertVehicleScreen {
  data?: Vehicle;
}

export default function UpsertVehicleScreen({ data }: IUpsertVehicleScreen) {
  const { t } = useTranslation();
  const { onSubmit } = useUpsertVehicleScreen();

  return (
    <Container>
      <KeyboardAware>
        <Container.TopText title={t("vehicleDetails:screenTitle")} subtitle={t("vehicleDetails:subtitle")} />
        <UpsertVehicleForm onSubmit={onSubmit} initialData={data} />
      </KeyboardAware>
    </Container>
  );
}
