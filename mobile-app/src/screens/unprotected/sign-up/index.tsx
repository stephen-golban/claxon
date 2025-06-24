import React from "react";
import { Modal } from "react-native";

import { useTranslation } from "@/hooks";
import useSignUpScreen from "./hook";

import { Container, KeyboardAware } from "@/components/common";
import VerifyPhoneScreen from "../verify-phone";
import SignUpForm from "./form";

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { onSubmit, verifying, phone, handleResendCode, handleVerification } = useSignUpScreen();

  return (
    <>
      <Container>
        <KeyboardAware>
          <Container.TopText title={t("getStarted:signup:title")} subtitle={t("getStarted:signup:subtitle")} />
          <SignUpForm onSubmit={onSubmit} />
        </KeyboardAware>
      </Container>
      <Modal visible={verifying} transparent animationType="slide" presentationStyle="overFullScreen">
        <VerifyPhoneScreen phone={phone} onResend={handleResendCode} onSubmit={handleVerification} />
      </Modal>
    </>
  );
}
