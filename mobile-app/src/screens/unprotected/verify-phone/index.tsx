import type React from "react";

import { useTranslation } from "@/hooks";

import { Container } from "@/components/common";
import { OtpField } from "@/components/form-elements";
import { Text } from "@/components/ui/text";
import { Keyboard, View } from "react-native";
import OtpResend from "./otp-resend";

import { ToastProvider } from "@/components/ui/toast";
import { formatPhoneNumber } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type OtpFormData, defaultValues, resolver } from "./schema";

interface IVerifyPhoneScreen {
  phone: string;
  onResend: () => void;
  onSubmit: (code: string) => Promise<void>;
}

export default function VerifyPhoneScreen({ phone, onSubmit, onResend }: IVerifyPhoneScreen) {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const hook = useForm<OtpFormData>({ resolver, defaultValues, mode: "onChange" });

  const prepare = async (dto: OtpFormData) => {
    Keyboard.dismiss();
    await onSubmit(dto.otp);
  };

  const formattedPhone = formatPhoneNumber(phone);

  const handleResend = () => {
    Keyboard.dismiss();
    onResend();
    hook.reset();
  };

  return (
    <>
      <Container loading={hook.formState.isSubmitting} style={{ paddingTop: top }}>
        <Container.TopText
          title={t("verificationCode:sentNewline")}
          subtitle={t("verificationCode:sent", { phone: formattedPhone })}
        />

        <Text className="mt-4 text-3xl font-bold text-dark dark:text-light">{t("verificationCode:code")}</Text>

        <View className="mt-4 flex-1">
          <OtpField name="otp" control={hook.control} onFilled={hook.handleSubmit(prepare)} />
          <OtpResend onResend={handleResend} />
        </View>
      </Container>
      <ToastProvider />
    </>
  );
}
