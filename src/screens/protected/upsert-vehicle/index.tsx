import { Container, ErrorScreen, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";
import UpsertVehicleForm from "./form";
import useUpsertVehicleScreen from "./hook";

export default function UpsertVehicleScreen() {
  const { t } = useTranslation();
  const { onSubmit, error } = useUpsertVehicleScreen();

  // Show error state if there's an error
  if (error) {
    return <ErrorScreen message={t("vehicleDetails:errorMessage")} />;
  }

  return (
    <Container>
      <KeyboardAware>
        <Container.TopText title={t("vehicleDetails:screenTitle")} subtitle={t("vehicleDetails:subtitle")} />
        <UpsertVehicleForm onSubmit={onSubmit} />
      </KeyboardAware>
    </Container>
  );
}
