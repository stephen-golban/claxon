import { useRouter } from "expo-router";
import { useGetMe, useUpdateAccount } from "@/services/api/accounts";
import { supabase } from "@/services/api/client";
import { useDeleteImage, useUploadImage } from "@/services/api/image";
import type { PersonalDetailsFormData } from "./form/schema";

export default function usePersonalDetailsScreen() {
  const router = useRouter();
  const { data: currentUser, isPending: isUserPending, isLoading: isUserLoading, error } = useGetMe();

  const updateAccount = useUpdateAccount();
  const [, uploadImage] = useUploadImage("account-avatar");
  const deleteImage = useDeleteImage("account-avatar");

  const isLoading = uploadImage.isPending || updateAccount.isPending;

  const handleAvatarUpload = async (image: PersonalDetailsFormData["image"]) => {
    if (!image.uri || !image.path) return currentUser?.avatar_url || "";

    // Delete existing avatar before uploading new one
    if (currentUser?.avatar_url) {
      try {
        await deleteImage.mutateAsync(currentUser.avatar_url);
      } catch (error) {
        console.warn("Failed to delete existing avatar:", error);
      }
    }

    const result = await uploadImage.mutateAsync(image);
    return result?.path || "";
  };

  const onSubmit = async (formData: PersonalDetailsFormData) => {
    if (isLoading) return;

    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { image, ...accountData } = formData;

    const avatarUrl = await handleAvatarUpload(image);

    return updateAccount.mutateAsync(
      {
        id: data.user.id,
        dto: {
          ...accountData,
          avatar_url: avatarUrl,
          dob: accountData.dob.toISOString(),
        },
      },
      {
        onSuccess: () => router.dismissTo("/(protected)"),
      },
    );
  };

  return {
    onSubmit,
    isLoading,
    isPending: isUserPending,
    isUserLoading,
    error,
    currentUser,
  };
}
