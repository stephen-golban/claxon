import { useCallback, useState } from "react";
import { toast } from "@/components/ui/toast";
import { useTranslation } from "@/hooks";

export function useOtpResend() {
	const { t } = useTranslation();
	const [resending, setResending] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);
	const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");

	// biome-ignore lint/correctness/useExhaustiveDependencies: we don't need to re-render the component
	const resend = useCallback(() => {
		try {
			setResending(true);
			setResendStatus("success");
			toast.success(t("verificationCode:resentCode"));
			setResendCooldown(30); // 30 second cooldown

			const timer = setInterval(() => {
				setResendCooldown((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						setResendStatus("idle");
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} catch (error) {
			setResendStatus("error");
			console.log((error as Error).message);
			setTimeout(() => setResendStatus("idle"), 3000);
		} finally {
			setResending(false);
		}
	}, []);

	return {
		resend,
		resending,
		resendStatus,
		resendCooldown,
	};
}
