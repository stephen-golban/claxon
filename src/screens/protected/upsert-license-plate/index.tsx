import { Container, ErrorScreen, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";
import UpsertLicensePlateForm from "./form";
import useUpsertLicensePlateScreen from "./hook";

export default function UpsertLicensePlateScreen() {
  const { t } = useTranslation();
  const { onSubmit, error, vehicleId } = useUpsertLicensePlateScreen();

  // Show error state if there's an error
  if (error) {
    return <ErrorScreen message={t("vehiclePlate:errorMessage")} />;
  }

  // Show error if no vehicle ID is provided
  if (!vehicleId) {
    return <ErrorScreen message="Vehicle ID is required" />;
  }

  return (
    <Container>
      <KeyboardAware>
        <Container.TopText title={t("vehiclePlate:screenTitle")} subtitle={t("vehiclePlate:subtitle")} />
        <UpsertLicensePlateForm onSubmit={onSubmit} />
      </KeyboardAware>
    </Container>
  );
}
