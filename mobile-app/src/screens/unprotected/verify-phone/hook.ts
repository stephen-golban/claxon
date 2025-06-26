import { useRouter } from "expo-router";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import type { Account } from "@/services/api/accounts";
import { useVerifyCode } from "@/services/api/auth";
import { setAppStoreKeys } from "@/stores/app";
import { defaultValues, type OtpFormData, resolver } from "./schema";

const getAccountStatus = (account: Account) => {
	return (
		!isEmpty(account.email) &&
		!isEmpty(account.first_name) &&
		!isEmpty(account.last_name) &&
		!isEmpty(account.dob) &&
		!isEmpty(account.gender)
	);
};

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
				onSuccess: ({ account, session, user }) => {
					const isAuthenticated = !!session && !!user;
					const hasCompletedOnboarding = getAccountStatus(account);

					setAppStoreKeys({ isAuthenticated });
					if (hasCompletedOnboarding) {
						router.replace("/(protected)");
					} else {
						router.replace("/(protected)/personal-details");
					}
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
