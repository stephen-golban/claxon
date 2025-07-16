import { useRouter } from "expo-router";

export interface WelcomeActionConfig {
  id: string;
  title: string;
  description: string;
  iconName: "car" | "search" | "plus";
  action: () => void;
}

export const useWelcomeActions = (isProfileComplete: boolean) => {
  const router = useRouter();

  const quickActions: WelcomeActionConfig[] = [
    ...(isProfileComplete
      ? []
      : [
          {
            id: "complete-profile",
            title: "Complete Profile",
            description: "Finish setting up your personal details",
            iconName: "car" as const,
            action: () => router.push("/account/personal-details"),
          } satisfies WelcomeActionConfig,
        ]),
    {
      id: "register-car",
      title: "Register Your First Car",
      description: "Add your first vehicle to receive claxon notifications",
      iconName: "plus",
      action: () => router.push("/my-cars/add-new"),
    },
    {
      id: "explore-app",
      title: "Explore Claxon",
      description: "Discover how to send messages via license plates",
      iconName: "search",
      action: () => router.push("/(protected)/search"),
    },
  ];

  return {
    quickActions,
  };
};
