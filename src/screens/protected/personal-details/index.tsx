import { Container, ErrorScreen, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";
import PersonalDetailsForm from "./form";
import usePersonalDetailsScreen from "./hook";

export default function PersonalDetailsScreen() {
  const { t } = useTranslation();
  const { onSubmit, isUploading, isPending, isLoading, error, currentUser } = usePersonalDetailsScreen();

  // Show error state if user data failed to load
  if (error || !currentUser) {
    return <ErrorScreen message="Failed to load profile data" />;
  }

  return (
    <Container loading={isPending || isLoading}>
      <KeyboardAware>
        <Container.TopText title={t("personalDetails:screenTitle")} subtitle={t("personalDetails:subtitle")} />
        <PersonalDetailsForm onSubmit={onSubmit} isUploading={isUploading} />
      </KeyboardAware>
    </Container>
  );
}
