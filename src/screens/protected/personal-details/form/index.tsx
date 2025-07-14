import type React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import * as FormElements from "@/components/form-elements";
import { useTranslation } from "@/hooks";
import { defaultValues, type PersonalDetailsFormData, resolver } from "./schema";

interface IPersonalDetailsForm {
  isUploading: boolean;
  onSubmit: (data: PersonalDetailsFormData) => void;
}

const PersonalDetailsForm: React.FC<IPersonalDetailsForm> = ({ onSubmit, isUploading }) => {
  const { t } = useTranslation();

  const hook = useForm<PersonalDetailsFormData>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  return (
    <FormProvider {...hook}>
      <View className="flex-1 gap-y-4 mt-5">
        <View className="flex-row items-start gap-x-4">
          <View className="flex-1">
            <FormElements.TextField
              control={hook.control}
              name="first_name"
              placeholder="Enter First Name"
              label="First Name"
            />
          </View>
          <View className="flex-1">
            <FormElements.TextField
              control={hook.control}
              name="last_name"
              placeholder="Enter Last Name"
              label="Last Name"
            />
          </View>
        </View>
        <View className="gap-y-4 flex-1">
          <View>
            <FormElements.EmailField control={hook.control} name="email" placeholder="Enter Email" label="Email" />
          </View>

          <View>
            <FormElements.SelectField
              control={hook.control}
              label="Gender"
              name="gender"
              placeholder="Select Gender"
              options={[
                { value: "male", label: t("options:gender:male") },
                { value: "female", label: t("options:gender:female") },
              ]}
            />
          </View>

          <View>
            <FormElements.DatePickerField control={hook.control} name="dob" label="Date of Birth" />
          </View>
          {/* <View>
            <FormElements.AvatarField name="image" control={hook.control} />
          </View> */}
        </View>
      </View>

      <FormElements.SubmitButton
        isDisabled={!hook.formState.isValid}
        onSubmit={hook.handleSubmit(onSubmit)}
        isSubmitting={hook.formState.isSubmitting || isUploading}
      />
    </FormProvider>
  );
};

export default PersonalDetailsForm;
