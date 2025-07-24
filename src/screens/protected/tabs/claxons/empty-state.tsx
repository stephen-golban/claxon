import type React from "react";
import { View } from "react-native";
import { MessageSquareIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface EmptyStateProps {
  title: string;
  description: string;
  showAction?: boolean;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  showAction = false,
  actionText = "Send a Claxon",
  onAction,
}) => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="items-center mb-8">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <MessageSquareIcon size={40} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-bold text-foreground mb-2 text-center">{title}</Text>
      <Text className="text-base text-muted-foreground text-center leading-6">{description}</Text>
    </View>
    {showAction && onAction && (
      <Button onPress={onAction} className="rounded-2xl px-8" size="lg">
        <Text className="font-semibold">{actionText}</Text>
      </Button>
    )}
  </View>
);

export default EmptyState;
