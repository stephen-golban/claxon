import { Container, ErrorScreen, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";
import AddVehicleForm from "./form";
import useAddNewVehicleScreen from "./hook";

export default function AddNewVehicleScreen() {
  const { t } = useTranslation();
  const { onSubmit, isSubmitting, error } = useAddNewVehicleScreen();

  // Show error state if there's an error
  if (error) {
    return <ErrorScreen message={t("vehicleDetails:errorMessage")} />;
  }

  return (
    <Container loading={isSubmitting}>
      <KeyboardAware>
        <Container.TopText 
          title={t("vehicleDetails:screenTitle")} 
          subtitle={t("vehicleDetails:subtitle")} 
        />
        <AddVehicleForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </KeyboardAware>
    </Container>
  );
}
