import { Container, KeyboardAware } from "@/components/common";
import VehicleForm from "@/components/forms/vehicle";
import { useTranslation } from "@/hooks";
import useUpsertVehicleScreen from "./hook";

export default function CreateVehicleScreen() {
  const { t } = useTranslation();
  const { onSubmit } = useUpsertVehicleScreen();

  return (
    <Container>
      <KeyboardAware>
        <Container.TopText title={t("vehicleDetails:screenTitle")} subtitle={t("vehicleDetails:subtitle")} />
        <VehicleForm onSubmit={onSubmit} />
      </KeyboardAware>
    </Container>
  );
}
