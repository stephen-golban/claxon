import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { toast } from "@/components/ui/toast";

import { APP_CONSTANTS } from "@/lib/constants";
import { ERROR_CODES } from "@/lib/constants/errors";
import { useCreateUser } from "@/services/api-old";
import { useAppStore } from "@/stores/app";
import type { SignUpFormData } from "./form/schema";

export default function useSignUpScreen() {
	const router = useRouter();
	const { language } = useAppStore();
	const { isLoaded, signUp, setActive } = useSignUp();

	const [verifying, setVerifying] = useState(false);
	const [data, setData] = useState<SignUpFormData | null>(null);

	const createUserMutation = useCreateUser();

	const onClerkError = (error: unknown) => {
		console.error(error);
		if (isClerkAPIResponseError(error)) {
			for (const err of error.errors) {
				if (err.longMessage) {
					toast.error(err.longMessage);
				}
			}
		}
	};

	const onSubmit = async (data: SignUpFormData) => {
		if (!isLoaded || !signUp) return;

		try {
			setData(data);
			await signUp.create({
				phoneNumber: data.phone,
				legalAccepted: data.termsAccepted,
			});

			await signUp.preparePhoneNumberVerification();
			setVerifying(true);
		} catch (err) {
			onClerkError(err);
		}
	};

	async function handleVerification(code: string) {
		if (!isLoaded || !signUp || !data) return;

		try {
			const signUpAttempt = await signUp.attemptPhoneNumberVerification({
				code,
			});

			if (signUpAttempt.status === "complete") {
				try {
					// Create the user with avatar URL if available
					await createUserMutation.mutateAsync(
						{
							phone: data.phone || "",
							email: data.email || "",
							gender: data.gender || "",
							clerkId: signUpAttempt.createdUserId || "",
							language: language || APP_CONSTANTS.DEFAULT_LANGUAGE,
							avatarUrl: data.image.uploadedUrl,
							privacySettings: JSON.stringify({}),
							isPhonePublic: true,
							lastName: data.last_name || "",
							firstName: data.first_name || "",
							notificationPreferences: JSON.stringify({}),
							dob: data.dob?.toISOString() || "",
						},
						{
							onSuccess: async () => {
								await setActive({ session: signUpAttempt.createdSessionId });
								setVerifying(false);
								router.replace("/(protected)");
							},
							onError: async (error) => {
								console.error("Failed to create user:", error);
								await setActive({ session: null });
								toast.error(ERROR_CODES.USER_CREATION_FAILED);
							},
						},
					);
				} catch (error) {
					console.error("Failed to create user:", error);
					toast.error(ERROR_CODES.USER_CREATION_FAILED);
				}
			}
		} catch (err) {
			onClerkError(err);
		}
	}

	const handleResendCode = async () => {
		if (!isLoaded || !signUp) return;
		try {
			await signUp.preparePhoneNumberVerification();
			toast.success("Verification code sent");
		} catch (err) {
			onClerkError(err);
		}
	};

	return {
		verifying,
		phone: data?.phone || "",
		onSubmit,
		handleResendCode,
		handleVerification,
		isLoading: createUserMutation.isPending,
	};
}
