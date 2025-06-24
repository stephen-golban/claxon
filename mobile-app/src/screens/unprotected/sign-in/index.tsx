import React from "react";
import { Modal } from "react-native";

import { useTranslation } from "@/hooks";
import useSignInScreen from "./hook";

import VerifyPhoneScreen from "../verify-phone";

import { Container, KeyboardAware } from "@/components/common";
import SignInForm from "./form";

export default function SignInScreen() {
  const { t } = useTranslation();
  const { onSubmit, verifying, phone, handleResendCode, handleVerification } = useSignInScreen();

  return (
    <>
      <Container>
        <KeyboardAware>
          <Container.TopText title={t("getStarted:signin:title")} subtitle={t("getStarted:signin:subtitle")} />
          <SignInForm onSubmit={onSubmit} />
        </KeyboardAware>
      </Container>
      <Modal visible={verifying} transparent animationType="slide" presentationStyle="overFullScreen">
        <VerifyPhoneScreen phone={phone} onResend={handleResendCode} onSubmit={handleVerification} />
      </Modal>
    </>
  );
}
