import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";

import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { PhoneField, SubmitButton } from "@/components/form-elements";
import TermsAcceptance from "../../terms-acceptance";
import { type SignInFormData, signInSchema } from "./schema";

interface ISignInForm {
  onSubmit: (data: SignInFormData) => void;
}

const resolver = zodResolver(signInSchema);
const defaultValues = {
  phone: "",
};

const SignInForm: React.FC<ISignInForm> = ({ onSubmit }) => {
  const hook = useForm<SignInFormData>({ resolver, defaultValues, mode: "onChange" });
  const { control, handleSubmit, formState } = hook;

  const preparePhone = (dto: SignInFormData) => {
    const cleaned = dto.phone.replace(/\s/g, "");
    const phone = `+373${cleaned}`;
    return onSubmit({ phone });
  };

  return (
    <FormProvider {...hook}>
      <View className="flex-1 gap-y-4">
        <PhoneField control={control} name="phone" />
        <TermsAcceptance type="login" />
      </View>

      <SubmitButton
        isDisabled={!formState.isValid}
        onSubmit={handleSubmit(preparePhone)}
        isSubmitting={formState.isSubmitting}
      />
    </FormProvider>
  );
};

export default SignInForm;
