import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import type { PhoneCodeFactor, SignInFirstFactor } from "@clerk/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import type { SignInFormData } from "./form/schema";

export default function useSignInScreen() {
	const router = useRouter();
	const { isLoaded, signIn, setActive } = useSignIn();

	const [phone, setPhone] = useState("");
	const [verifying, setVerifying] = useState(false);

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

	const onSubmit = async (data: SignInFormData) => {
		if (!isLoaded && !signIn) return null;

		try {
			setPhone(data.phone);
			// Start the sign-in process using the phone number method
			const { supportedFirstFactors } = await signIn.create({ identifier: data.phone });

			// Filter the returned array to find the 'phone_code' entry
			const isPhoneCodeFactor = (factor: SignInFirstFactor): factor is PhoneCodeFactor => {
				return factor.strategy === "phone_code";
			};
			const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

			if (phoneCodeFactor) {
				// Grab the phoneNumberId
				const { phoneNumberId } = phoneCodeFactor;

				// Send the OTP code to the user
				await signIn.prepareFirstFactor({ strategy: "phone_code", phoneNumberId });

				// Set verifying to true to display second form
				// and capture the OTP code
				setVerifying(true);
			}
		} catch (err) {
			onClerkError(err);
		}
	};

	async function handleVerification(code: string) {
		if (!isLoaded && !signIn) return null;

		try {
			// Use the code provided by the user and attempt verification
			const signInAttempt = await signIn.attemptFirstFactor({ strategy: "phone_code", code });

			// If verification was completed, set the session to active
			// and redirect the user
			if (signInAttempt.status === "complete") {
				await setActive({ session: signInAttempt.createdSessionId });

				router.replace("/(protected)");
				setVerifying(false);
			}
		} catch (err) {
			onClerkError(err);
		}
	}

	const handleResendCode = async () => {
		if (!isLoaded && !signIn) return null;
		try {
			await onSubmit({ phone });
		} catch (err) {
			onClerkError(err);
		}
	};

	return {
		phone,
		verifying,
		onSubmit,
		handleResendCode,
		handleVerification,
	};
}
