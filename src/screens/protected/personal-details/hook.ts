import { useRouter } from "expo-router";
import { useGetMe, useUpdateAccount } from "@/services/api/accounts";
import { supabase } from "@/services/api/client";
import { useDeleteImage, useUploadImage } from "@/services/api/image";
import type { PersonalDetailsFormData } from "./form/schema";

export default function usePersonalDetailsScreen() {
  const router = useRouter();

  const me = useGetMe();
  const updateAccount = useUpdateAccount();
  const deleteImage = useDeleteImage("account-avatar");
  const [, uploadImage] = useUploadImage("account-avatar");

  const isUploading = uploadImage.isPending || deleteImage.isPending;

  const handleAvatarUpload = async (image: PersonalDetailsFormData["image"]) => {
    if (!image.uri || !image.path) return me.data?.avatar_url || "";

    // Delete existing avatar before uploading new one
    if (me.data?.avatar_url) {
      try {
        await deleteImage.mutateAsync(me.data.avatar_url);
      } catch (error) {
        console.warn("Failed to delete existing avatar:", error);
      }
    }

    const result = await uploadImage.mutateAsync(image);
    return result?.path || "";
  };

  const onSubmit = async (formData: PersonalDetailsFormData) => {
    if (me.isPending || updateAccount.isPending || uploadImage.isPending) return;

    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { image, ...accountData } = formData;

    const avatarUrl = await handleAvatarUpload(image);

    await updateAccount.mutateAsync(
      {
        id: data.user.id,
        dto: {
          ...accountData,
          avatar_url: avatarUrl,
          dob: accountData.dob.toISOString(),
        },
      },
      {
        onSuccess: () => router.back(),
      },
    );
  };

  return {
    onSubmit,
    isUploading,
    currentUser: me.data,
    error: updateAccount.error,
    isLoading: me.isPending || me.isLoading,
  };
}
