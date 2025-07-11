import { Container, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";
import PersonalDetailsForm from "./form";
import usePersonalDetailsScreen from "./hook";

export default function PersonalDetailsScreen() {
  const { t } = useTranslation();
  const { onSubmit, isUploading } = usePersonalDetailsScreen();

  return (
    <Container>
      <KeyboardAware>
        <Container.TopText title={t("personalDetails:screenTitle")} subtitle={t("personalDetails:subtitle")} />
        <PersonalDetailsForm onSubmit={onSubmit} isUploading={isUploading} />
      </KeyboardAware>
    </Container>
  );
}
