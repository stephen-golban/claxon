import LottieView from "lottie-react-native";
import type React from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

interface WelcomeHeaderProps {
  title?: string;
  subtitle?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  title = "Welcome to Claxon! 🚗",
  subtitle = "Your journey starts here. Choose how you'd like to get started with Moldova's first license plate messaging app.",
}) => {
  return (
    <View className="items-center pt-4 pb-6">
      <View className="mb-6 p-6 bg-primary/5 rounded-3xl">
        <LottieView
          autoPlay
          loop
          source={require("@/assets/animations/claxon.lottie")}
          style={{ width: 120, height: 120 }}
        />
      </View>

      <Text className="text-3xl font-bold text-center mb-3 text-foreground">{title}</Text>

      <Text className="text-base text-center text-muted-foreground leading-relaxed px-6 max-w-sm">{subtitle}</Text>
    </View>
  );
};

export { WelcomeHeader };
