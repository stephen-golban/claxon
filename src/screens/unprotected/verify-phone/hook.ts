import { useRouter } from "expo-router";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { toast } from "@/components/ui/toast";
import { translateError } from "@/lib/utils";
import type { Account } from "@/services/api/accounts";
import { AuthService, useVerifyCode } from "@/services/api/auth";
import { setAppStoreKey, setAppStoreKeys } from "@/stores/app";
import { defaultValues, type OtpFormData, resolver } from "./schema";

const hasFilledPersonalDetails = (account: Account) => {
	return (
		!isEmpty(account.first_name) &&
		!isEmpty(account.last_name) &&
		!isEmpty(account.dob) &&
		!isEmpty(account.avatar_url) &&
		!isEmpty(account.email)
	);
};

export function useVerifyPhoneScreen(phone: string) {
	const router = useRouter();
	const service = new AuthService();

	const hook = useForm<OtpFormData>({
		resolver,
		defaultValues,
		mode: "onChange",
	});

	const { control, handleSubmit, formState } = hook;

	const onSubmit = async (dto: OtpFormData) => {
		Keyboard.dismiss();
		try {
			const { session, user, account } = await service.verifyCode({
				phone,
				code: dto.otp,
			});

			if (!isEmpty(account)) {
				const isAuthenticated = !!session && !!user;

				setAppStoreKey("isAuthenticated", isAuthenticated);
				const hasFilled = hasFilledPersonalDetails(account);
				if (hasFilled) {
					return router.dismissTo("/(protected)");
				}
				return router.dismissTo("/(protected)/personal-details");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(translateError(error.message));
			}
		}
	};

	return {
		control,
		reset: hook.reset,
		errors: formState.errors,
		handleSubmit: handleSubmit(onSubmit),
		isSubmitting: formState.isSubmitting,
	};
}
