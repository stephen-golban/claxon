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
		const { image, ...rest } = dto;

		const { path } = await uploadMutation.mutateAsync(image);

		if (!path || !res.data.user) return;

		const profile = await mutateAsync(
			{
				id: res.data.user.id,
				dto: {
					...rest,
					avatar_url: path,
					dob: rest.dob.toISOString(),
				},
			},
			{
				onSuccess: () => {
					return router.dismissTo("/(protected)");
				},
			},
		);

		return profile;
	};

	return { onSubmit, isUploading };
}
