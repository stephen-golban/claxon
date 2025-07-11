import { useRouter } from "expo-router";
import { useAuthenticate } from "@/services/api/auth";
import type { SignInFormData } from "./form/schema";

export default function useGetStartedScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useAuthenticate();

  const onSubmit = async (data: SignInFormData) => {
    await mutateAsync(data.phone, {
      onSuccess: (data, phone) => {
        if (!data) return;
        router.dismissAll();
        router.replace({ pathname: "/verify", params: { phone } });
        return;
      },
    });
  };

  return {
    isPending,
    onSubmit,
  };
}
