import type React from "react";
import { ScrollView, View } from "react-native";

import { Container } from "@/components/common";
import type { Account } from "@/services/api/accounts";
import { FeatureHighlights } from "./feature-highlights";
import { useWelcomeActions } from "./hook";
import { QuickActions } from "./quick-actions";
import { WelcomeHeader } from "./welcome-header";

interface IWelcomeScreen {
  data: Account;
}

const isProfileComplete = (account: Account): boolean => {
  const requiredFields = ["email", "first_name", "last_name", "dob", "gender", "avatar_url"] as const;
  return requiredFields.every((field) => !!account[field]);
};

const WelcomeScreen: React.FC<IWelcomeScreen> = ({ data }) => {
  const shouldShowProfile = isProfileComplete(data);
  const { quickActions } = useWelcomeActions(shouldShowProfile);

  return (
    <Container removeEdges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <WelcomeHeader />

        <View className="flex-1 pb-8">
          <QuickActions actions={quickActions} />
          <FeatureHighlights />
        </View>
      </ScrollView>
    </Container>
  );
};

export { WelcomeScreen };
