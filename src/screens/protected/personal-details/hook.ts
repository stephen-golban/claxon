import { useRouter } from "expo-router";
import { useGetMe, useUpdateAccount } from "@/services/api/accounts";
import { supabase } from "@/services/api/client";
import { useUploadImage } from "@/services/api/image";
import type { PersonalDetailsFormData } from "./form/schema";

export default function usePersonalDetailsScreen() {
  const router = useRouter();
  const { data: currentUser, isPending, isLoading, error } = useGetMe();

  const account = useUpdateAccount();
  const [, uploadMutation] = useUploadImage("account-avatar");

  const isUploading = uploadMutation.isPending;

  const onSubmit = async (dto: PersonalDetailsFormData) => {
    if (isUploading || account.isPending) return;

    const res = await supabase.auth.getUser();
    const { image, ...rest } = dto;

    if (!res.data.user) return;

    // Determine avatar URL - upload new image if provided, otherwise keep existing
    let avatarUrl = currentUser?.avatar_url || "";

    // Only upload if user selected a new image (has uri)
    if (image.uri && image.path) {
      const uploadResult = await uploadMutation.mutateAsync(image);
      if (uploadResult?.path) {
        avatarUrl = uploadResult.path;
      }
    }

    const result = await account.mutateAsync(
      {
        id: res.data.user.id,
        dto: {
          ...rest,
          avatar_url: avatarUrl,
          dob: rest.dob.toISOString(),
        },
      },
      {
        onSuccess: () => {
          return router.dismissTo("/(protected)");
        },
      },
    );

    return result;
  };

  return { onSubmit, isUploading, isPending, isLoading, error, currentUser };
}
