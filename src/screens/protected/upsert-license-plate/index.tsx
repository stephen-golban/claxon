import { Container, ErrorScreen, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";
import type { Vehicle } from "@/services/api/vehicles";
import UpsertLicensePlateForm from "./form";
import useUpsertLicensePlateScreen from "./hook";

interface IUpsertLicensePlateScreen {
  data?: Vehicle;
}

export default function UpsertLicensePlateScreen({ data }: IUpsertLicensePlateScreen) {
  const { t } = useTranslation();
  const { onSubmit, id } = useUpsertLicensePlateScreen();

  // Show error if no vehicle ID is provided
  if (!id) {
    return <ErrorScreen message="Vehicle ID is required" />;
  }

  return (
    <Container>
      <KeyboardAware>
        <Container.TopText title={t("vehiclePlate:screenTitle")} subtitle={t("vehiclePlate:subtitle")} />
        <UpsertLicensePlateForm onSubmit={onSubmit} initialData={data} />
      </KeyboardAware>
    </Container>
  );
}
