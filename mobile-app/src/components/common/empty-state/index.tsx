import type React from "react";

import { cn } from "@/lib/utils";

import { Text } from "@/components/ui/text";
import LottieView from "lottie-react-native";
import { View } from "react-native";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <View className={cn("items-center justify-center p-4 w-full max-w-[400px]", className)}>
      <LottieView
        source={require("@/assets/animations/empty.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      <Text className="text-xl font-semibold text-center mb-2">{title}</Text>
      {description && <Text className="text-muted-foreground text-center mb-6">{description}</Text>}
      {action && <View className="w-full">{action}</View>}
    </View>
  );
}
