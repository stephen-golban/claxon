import type React from "react";

import { View } from "react-native";

import { useTranslation } from "@/hooks";
import { FormProvider, useForm } from "react-hook-form";

import { type SignUpFormData, defaultValues, resolver } from "./schema";

import * as FormElements from "@/components/form-elements";

interface ISignUpForm {
  onSubmit: (data: SignUpFormData) => void;
}

const SignUpForm: React.FC<ISignUpForm> = ({ onSubmit }) => {
  const { t } = useTranslation();

  const hook = useForm<SignUpFormData>({ resolver, defaultValues, mode: "onChange" });

  const { control, handleSubmit, formState } = hook;

  const prepareData = (dto: SignUpFormData) => {
    const cleaned = dto.phone.replace(/\s/g, "");
    const phone = `+373${cleaned}`;
    return onSubmit({ ...dto, phone });
  };

  return (
    <FormProvider {...hook}>
      <View className="flex-1 gap-y-4">
        <View>
          <FormElements.PhoneField control={control} name="phone" hideLabel />
        </View>
        <View className="flex-row items-start gap-x-4">
          <View className="flex-1">
            <FormElements.TextField
              control={hook.control}
              name="first_name"
              placeholder={t("placeholders:firstName")}
            />
          </View>
          <View className="flex-1">
            <FormElements.TextField control={hook.control} name="last_name" placeholder={t("placeholders:lastName")} />
          </View>
        </View>
        <View className="gap-y-4 flex-1">
          <View>
            <FormElements.EmailField control={hook.control} name="email" placeholder={t("placeholders:email")} />
          </View>

          <View>
            <FormElements.SelectField
              control={hook.control}
              name="gender"
              placeholder={t("placeholders:gender")}
              options={[
                { value: "male", label: t("options:gender:male") },
                { value: "female", label: t("options:gender:female") },
              ]}
            />
          </View>

          <View>
            <FormElements.DatePickerField control={hook.control} name="dob" />
          </View>
          <View>
            <FormElements.AvatarField name="image" control={hook.control} />
          </View>
          <View>
            <FormElements.TermsAcceptanceField control={hook.control} name="termsAccepted" type="signup" />
          </View>
        </View>
      </View>

      <FormElements.SubmitButton
        isDisabled={!formState.isValid}
        onSubmit={handleSubmit(prepareData)}
        isSubmitting={formState.isSubmitting}
      />
    </FormProvider>
  );
};

export default SignUpForm;
