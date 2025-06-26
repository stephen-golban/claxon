import { useCallback, useState } from "react";
import { toast } from "@/components/ui/toast";
import { useTranslation } from "@/hooks";
import { useResendCode } from "@/services/api/auth";

export function useOtpResend(phone: string) {
  const { t } = useTranslation();
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  const [resendCooldown, setResendCooldown] = useState(0);

  const { mutateAsync, isPending } = useResendCode();

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to pass the callback to the parent component
  const handleResend = useCallback(
    async (cb: () => void) => {
      if (isPending || resendCooldown > 0) return;
      await mutateAsync(phone, {
        onSuccess: () => {
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
        },
        onError: (error) => {
          setResendStatus("error");
          console.log(error.message);
          setTimeout(() => setResendStatus("idle"), 3000);
        },
      });
      cb();
    },
    [phone, isPending, resendCooldown],
  );

  return {
    resending: isPending,
    resendStatus,
    resendCooldown,
    handleResend,
  };
}
