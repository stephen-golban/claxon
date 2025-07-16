import type React from "react";
import { ScrollView, View } from "react-native";

import { Container } from "@/components/common";
import { isProfileComplete } from "@/lib/utils";
import type { Account } from "@/services/api/accounts";
import { FeatureHighlights } from "./feature-highlights";
import { useWelcomeActions } from "./hook";
import { QuickActions } from "./quick-actions";
import { WelcomeHeader } from "./welcome-header";

interface IWelcomeScreen {
  data: Account;
  vehicleCount: number;
}

const WelcomeScreen: React.FC<IWelcomeScreen> = ({ data, vehicleCount }) => {
  const hasVehicles = vehicleCount > 0;
  const shouldShowProfile = isProfileComplete(data);

  const { quickActions } = useWelcomeActions(shouldShowProfile, hasVehicles);

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
