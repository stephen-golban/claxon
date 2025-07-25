import { Container } from "@/components/common";
import LicensePlateForm from "@/components/forms/license-plate";
import useCreateLicensePlateScreen from "./hook";

export default function CreateLicensePlateScreen({ id }: { id: string }) {
  const { onSubmit, isLoading } = useCreateLicensePlateScreen(id);

  return (
    <Container>
      <Container.TopText title="License Plate" subtitle="Add a license plate to your vehicle" />
      <LicensePlateForm onSubmit={onSubmit} buttonTitle="Complete Vehicle Setup" isLoading={isLoading} />
    </Container>
  );
}
