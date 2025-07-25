import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import * as FormElements from "@/components/form-elements";
import { useGetMe } from "@/services/api/accounts";
import { createPersonalDetailsSchema, type PersonalDetailsFormData, transformAccountToFormData } from "./schema";
import { hasFormDataChanged } from "./util";

interface IPersonalDetailsForm {
  isUploading: boolean;
  onSubmit: (data: PersonalDetailsFormData) => void;
}

const PersonalDetailsForm: React.FC<IPersonalDetailsForm> = ({ onSubmit, isUploading }) => {
  const { data: accountData } = useGetMe();

  // Transform account data to form data format
  const formDefaultValues = transformAccountToFormData(accountData);

  // Create resolver based on whether user has existing avatar
  const hasExistingAvatar = !!accountData?.avatar_url;
  const schema = createPersonalDetailsSchema(hasExistingAvatar);
  const resolver = zodResolver(schema);

  const hook = useForm<PersonalDetailsFormData>({
    resolver,
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  // Store original values for change detection
  const originalValuesRef = useRef<PersonalDetailsFormData | null>(null);

  // Reset form values when account data becomes available
  useEffect(() => {
    if (accountData) {
      const newFormData = transformAccountToFormData(accountData);
      hook.reset(newFormData);
      // Store the original values for change detection
      originalValuesRef.current = newFormData;
    }
  }, [accountData, hook]);

  // Watch all form values to detect changes
  const currentFormValues = hook.watch();

  // Check if form has changes from original values
  const hasChanges = useMemo(() => {
    if (!originalValuesRef.current) {
      return false;
    }
    return hasFormDataChanged(originalValuesRef.current, currentFormValues);
  }, [currentFormValues]);

  return (
    <FormProvider {...hook}>
      <View className="flex-1 gap-y-4 mt-5">
        <View className="flex-row items-start gap-x-4">
          <View className="flex-1">
            <FormElements.TextField
              control={hook.control}
              name="first_name"
              placeholder="First Name"
              label="First Name"
            />
          </View>
          <View className="flex-1">
            <FormElements.TextField control={hook.control} name="last_name" placeholder="Last Name" label="Last Name" />
          </View>
        </View>
        <View className="gap-y-4 flex-1">
          <View>
            <FormElements.EmailField control={hook.control} name="email" placeholder="Email" label="Email" />
          </View>

          <View>
            <FormElements.GenderSelectField control={hook.control} label="Gender" name="gender" />
          </View>

          <View>
            <FormElements.DatePickerField control={hook.control} name="dob" label="Date of Birth" />
          </View>
          <View>
            <FormElements.AvatarField name="image" control={hook.control} existingAvatarUrl={accountData?.avatar_url} />
          </View>
        </View>
      </View>

      <FormElements.SubmitButton
        isDisabled={!hook.formState.isValid || !hasChanges}
        onSubmit={hook.handleSubmit(onSubmit)}
        isSubmitting={hook.formState.isSubmitting || isUploading}
      />
    </FormProvider>
  );
};

export default PersonalDetailsForm;
