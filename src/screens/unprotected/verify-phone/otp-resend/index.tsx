import type React from "react";
import { View } from "react-native";
import { LoadingSpinner } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { useOtpResend } from "./hook";

interface IOtpResend {
  phone: string;
  onResend: () => void;
}

const OtpResend: React.FC<IOtpResend> = ({ phone, onResend }) => {
  const { t } = useTranslation();
  const { resending, resendStatus, resendCooldown, handleResend } = useOtpResend(phone);

  return (
    <Button
      variant="ghost"
      onPress={() => handleResend(onResend)}
      className="mt-4 active:bg-transparent"
      disabled={resending || resendCooldown > 0}
    >
      {resendStatus === "success" && resendCooldown > 0 ? (
        <Text className="text-center font-medium text-foreground" disabled>
          {t("verificationCode:resending", { seconds: resendCooldown })}
        </Text>
      ) : resendStatus === "error" ? (
        <Text className="text-center font-medium text-destructive group-active:text-destructive" disabled>
          {t("verificationCode:error")}
        </Text>
      ) : (
        <View className="flex-row items-center gap-x-4">
          <Text className="text-center font-bold text-foreground group-active:text-foreground" disabled>
            {t("verificationCode:didNotReceiveCode")}
          </Text>
          {resending && <LoadingSpinner />}
        </View>
      )}
    </Button>
  );
};

export default OtpResend;
