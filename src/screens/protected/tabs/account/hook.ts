import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useGetAccountStatistics, useGetMe, useUpdateAccount } from "@/services/api/accounts";
import { supabase } from "@/services/api/client";

export default function useAccountScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query current user data and statistics
  const { data: user, isPending, isLoading, error } = useGetMe();
  const { data: statistics, isLoading: statsLoading } = useGetAccountStatistics();

  // Mutations
  const updateAccountMutation = useUpdateAccount();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          queryClient.clear();
          await supabase.auth.signOut();
          router.replace("/");
        },
      },
    ]);
  };

  const handleTogglePhoneSharing = async (enabled: boolean) => {
    if (!user) return;

    await updateAccountMutation.mutateAsync({
      dto: { is_phone_public: enabled },
      id: user.id,
    });
  };

  const handleLanguageChange = async (language: "en" | "ro" | "ru") => {
    if (!user) return;

    await updateAccountMutation.mutateAsync({
      dto: { language },
      id: user.id,
    });
  };

  const handleEditProfile = () => {
    router.push("/personal-details");
  };

  const handleNotificationSettings = () => {
    router.push("/notification-settings");
  };

  return {
    // Data
    user,
    statistics,

    // Loading states
    isPending,
    isLoading,
    error,
    statsLoading,
    isSubmitting: updateAccountMutation.isPending,

    // Handlers
    handleSignOut,
    handleTogglePhoneSharing,
    handleLanguageChange,
    handleEditProfile,
    handleNotificationSettings,
  };
}
