import type React from "react";
import { ScrollView, View } from "react-native";

import { Container } from "@/components/common";
import { FeatureHighlights } from "./feature-highlights";
import { useWelcomeActions } from "./hook";
import { QuickActions } from "./quick-actions";
import { WelcomeHeader } from "./welcome-header";

const WelcomeScreen: React.FC = () => {
  const { quickActions } = useWelcomeActions();

  return (
    <Container removeEdges={[]} className="bg-background">
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
