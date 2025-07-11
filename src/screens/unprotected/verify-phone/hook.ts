import { useRouter } from "expo-router";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { useVerifyCode } from "@/services/api/auth";
import { setAppStoreKey } from "@/stores/app";
import { defaultValues, type OtpFormData, resolver } from "./schema";

export function useVerifyPhoneScreen(phone: string) {
  const router = useRouter();
  const verify = useVerifyCode();

  const hook = useForm<OtpFormData>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const { control, handleSubmit, formState } = hook;

  const onSubmit = async (dto: OtpFormData) => {
    Keyboard.dismiss();

    await verify.mutateAsync(
      { phone, code: dto.otp },
      {
        onSuccess: ({ account, session, user }) => {
          if (!isEmpty(account)) {
            const isAuthenticated = !!session && !!user;

            setAppStoreKey("isAuthenticated", isAuthenticated);
            return router.dismissTo("/(protected)");
          }
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
