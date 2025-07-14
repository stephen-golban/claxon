import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useGetAccountStatistics, useGetMe, useUpdateAccountPhoneSharing } from "@/services/api/accounts";
import { supabase } from "@/services/api/client";
import type { AccountFormData } from "./form/schema";

export default function useAccountScreen() {
  const router = useRouter();

  // Query current user data and statistics
  const { data: user, isPending, isLoading, error } = useGetMe();
  const { data: statistics, isLoading: statsLoading } = useGetAccountStatistics();

  // Mutations
  const updatePhoneSharingMutation = useUpdateAccountPhoneSharing();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/");
        },
      },
    ]);
  };

  const handleTogglePhoneSharing = async (enabled: boolean) => {
    if (!user) return;

    await updatePhoneSharingMutation.mutateAsync({ isPhonePublic: enabled, id: user.id });
  };

  const handleEditProfile = () => {
    router.push("/personal-details");
  };

  const handleNotificationSettings = () => {
    Alert.alert("Coming Soon", "Notification preferences will be available in a future update");
  };

  const handleLanguageSettings = () => {
    Alert.alert("Coming Soon", "Language preferences will be available in a future update");
  };

  const onSubmit = async (data: AccountFormData) => {
    if (!user) return;

    // Handle form submission for account settings
    await handleTogglePhoneSharing(data.is_phone_public);
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
    isSubmitting: updatePhoneSharingMutation.isPending,

    // Handlers
    handleSignOut,
    handleTogglePhoneSharing,
    handleEditProfile,
    handleNotificationSettings,
    handleLanguageSettings,
    onSubmit,
  };
}
