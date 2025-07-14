import type React from "react";
import { View } from "react-native";
import { CarIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { WelcomeActionConfig } from "./hook";

interface QuickActionsProps {
  actions: WelcomeActionConfig[];
  title?: string;
}

const getIconByName = (iconName: string, size: number = 24, className: string = "") => {
  switch (iconName) {
    case "car":
      return <CarIcon size={size} className={className} />;
    case "search":
      return <SearchIcon size={size} className={className} />;
    case "plus":
      return <PlusIcon size={size} className={className} />;
    default:
      return <CarIcon size={size} className={className} />;
  }
};

const getIconClassName = (variant: string) => {
  switch (variant) {
    case "default":
      return "text-primary";
    case "secondary":
      return "text-secondary-foreground";
    case "outline":
      return "text-muted-foreground";
    default:
      return "text-primary";
  }
};

const getButtonVariant = (idx: number) => {
  switch (idx) {
    case 0:
      return "default";
    case 1:
      return "secondary";
    case 2:
      return "outline";
    default:
      return "default";
  }
};

const QuickActions: React.FC<QuickActionsProps> = ({ actions, title = "Quick Actions" }) => {
  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold mb-4 text-foreground">{title}</Text>

      <View className="gap-4">
        {actions.map((action, idx) => {
          const variant = getButtonVariant(idx);
          return (
            <Card key={action.id} className="bg-card border-border shadow-sm">
              <CardContent className="p-5">
                <View className="flex-row items-center gap-4 mb-4">
                  <View className="w-12 h-12 bg-muted/40 rounded-full items-center justify-center">
                    {getIconByName(action.iconName, 24, getIconClassName(variant))}
                  </View>

                  <View className="flex-1">
                    <Text className="font-semibold text-base text-card-foreground mb-1">{action.title}</Text>
                    <Text className="text-sm text-muted-foreground leading-relaxed">{action.description}</Text>
                  </View>
                </View>

                <Button onPress={action.action} variant={variant} size="lg" className="rounded-2xl">
                  <Text className="font-medium">{action.title}</Text>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </View>
    </View>
  );
};

export { QuickActions };
