import { useRouter } from "expo-router";
import { useUpdateAccount } from "@/services/api/accounts";
import { supabase } from "@/services/api/client";
import { useQueryImage } from "@/services/api/image";
import type { PersonalDetailsFormData } from "./form/schema";

export default function usePersonalDetailsScreen() {
  const router = useRouter();

  const { mutateAsync, isPending } = useUpdateAccount();
  const { uploadMutation, isUploading } = useQueryImage("profile-avatar");

  const onSubmit = async (dto: PersonalDetailsFormData) => {
    if (isUploading || isPending) return;

    const res = await supabase.auth.getUser();
    const { path } = await uploadMutation.mutateAsync(dto.image);

    if (!path || !res.data.user) return;

    const profile = await mutateAsync(
      {
        id: res.data.user.id,
        dto: {
          ...dto,
          avatar_url: path,
          dob: dto.dob.toISOString(),
        },
      },
      {
        onSuccess: () => {
          router.dismissAll();
          return router.replace("/(protected)");
        },
      },
    );

    return profile;
  };

  return { onSubmit, isUploading };
}
