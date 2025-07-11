import { Button } from "react-native";
import { Container, KeyboardAware } from "@/components/common";
import { useTranslation } from "@/hooks";
import { supabase } from "@/services/api/client";
import PersonalDetailsForm from "./form";
import usePersonalDetailsScreen from "./hook";

export default function PersonalDetailsScreen() {
  const { t } = useTranslation();
  const { onSubmit, isUploading } = usePersonalDetailsScreen();

  return (
    <Container removeEdges={[]}>
      <KeyboardAware>
        <Container.TopText title={t("personalDetails:screenTitle")} subtitle={t("personalDetails:subtitle")} />
        <Button title="logout" onPress={() => supabase.auth.signOut()} />
        <PersonalDetailsForm onSubmit={onSubmit} isUploading={isUploading} />
      </KeyboardAware>
    </Container>
  );
}
