import { useRouter } from "expo-router";

export interface WelcomeActionConfig {
  id: string;
  title: string;
  description: string;
  iconName: "car" | "search" | "plus";
  action: () => void;
  variant: "default" | "secondary" | "outline";
  priority: number;
}

export const useWelcomeActions = () => {
  const router = useRouter();

  const quickActions: WelcomeActionConfig[] = [
    {
      id: "complete-profile",
      title: "Complete Profile",
      description: "Finish setting up your personal details",
      iconName: "car",
      action: () => router.push("/personal-details"),
      variant: "default",
      priority: 1,
    },
    {
      id: "explore-app",
      title: "Explore Claxon",
      description: "Discover how to send messages via license plates",
      iconName: "search",
      action: () => router.push("/tabs"),
      variant: "secondary",
      priority: 2,
    },
    {
      id: "register-car",
      title: "Register Your First Car",
      description: "Add your first vehicle to receive claxon notifications",
      iconName: "plus",
      action: () => router.push("/tabs/my-cars"),
      variant: "outline",
      priority: 3,
    },
  ];

  return {
    quickActions,
  };
};
