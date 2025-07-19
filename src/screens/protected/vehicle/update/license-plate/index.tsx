import { isEmpty } from "lodash";
import { Container } from "@/components/common";
import LicensePlateForm from "@/components/forms/license-plate";
import type { Vehicle } from "@/services/api/vehicles";
import useUpdateLicensePlateScreen from "./hook";

interface IUpdateLicensePlateScreen {
  id: string;
  loading?: boolean;
  data?: Vehicle;
}

export default function UpdateLicensePlateScreen({ id, data, loading }: IUpdateLicensePlateScreen) {
  const { onSubmit, isLoading } = useUpdateLicensePlateScreen(id);

  const isEmptyState = !data || isEmpty(data);

  return (
    <Container loading={loading} isEmpty={isEmptyState}>
      <Container.TopText title="License Plate" subtitle="Update your vehicle license plate" />
      <LicensePlateForm onSubmit={onSubmit} buttonTitle="Update" initialData={data} isLoading={isLoading} />
    </Container>
  );
}
