import { Container, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";

import SignInForm from "./form";
import useGetStartedScreen from "./hook";

export default function GetStartedScreen() {
  const { t } = useTranslation();
  const { onSubmit } = useGetStartedScreen();

  return (
    <Container>
      <KeyboardAware>
        <Container.TopText title={t("getStarted:signin:title")} subtitle={t("getStarted:signin:subtitle")} />
        <SignInForm onSubmit={onSubmit} />
      </KeyboardAware>
    </Container>
  );
}
