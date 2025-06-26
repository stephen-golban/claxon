import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { useVerifyCode } from "@/services/api/auth";
import { setAppStoreKeys } from "@/stores/app";
import { defaultValues, type OtpFormData, resolver } from "./schema";

export function useVerifyPhoneScreen(phone: string) {
  const router = useRouter();
  const verify = useVerifyCode();

  const hook = useForm<OtpFormData>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const { setError, control, handleSubmit, formState } = hook;

  const onSubmit = async (dto: OtpFormData) => {
    Keyboard.dismiss();
    await verify.mutateAsync(
      { phone, code: dto.otp },
      {
        onSuccess: ({ session, user }) => {
          const isAuthenticated = !!session && !!user;

          setAppStoreKeys({ isAuthenticated });
          return router.replace("/(protected)");
        },
        onError: (error) => {
          setError("otp", { message: error.message });
          console.log(error);
        },
      },
    );
  };

  return {
    control,
    reset: hook.reset,
    errors: formState.errors,
    handleSubmit: handleSubmit(onSubmit),
    isSubmitting: formState.isSubmitting,
  };
}
