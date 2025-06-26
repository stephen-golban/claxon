import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import * as FormElements from "@/components/form-elements";
import { useTranslation } from "@/hooks";
import { APP_CONSTANTS } from "@/lib/constants";
import type { User } from "@/services/api-old";
import { defaultValues, type ProfileFormData, resolver } from "./schema";

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void;
  isLoading?: boolean;
  initialData?: User;
}

export function ProfileForm({ onSubmit, isLoading = false, initialData }: ProfileFormProps) {
  const { t } = useTranslation();

  // Use current user data if available, otherwise fall back to default values
  const formDefaultValues: ProfileFormData = initialData
    ? {
        first_name: initialData.firstName || "",
        last_name: initialData.lastName || "",
        email: initialData.email || "",
        dob: initialData.dob ? new Date(initialData.dob) : undefined,
        gender: initialData.gender ?? undefined,
        share_phone: initialData.isPhonePublic ?? undefined,
        language: initialData.language as "ro" | "en" | "ru" | undefined,
        avatar: initialData.avatarUrl
          ? {
              uri: initialData.avatarUrl,
              path: "",
              mimeType: "",
              arraybuffer: new ArrayBuffer(0),
            }
          : undefined,
      }
    : defaultValues;

  const form = useForm<ProfileFormData>({
    resolver,
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const { control, handleSubmit, formState } = form;

  const languageOptions = APP_CONSTANTS.SUPPORTED_LANGUAGES.map((lang) => ({
    value: lang,
    label: lang === "ro" ? "Romanian" : lang === "en" ? "English" : "Russian",
  }));

  const genderOptions = [
    { value: "male", label: t("options:gender:male") },
    { value: "female", label: t("options:gender:female") },
  ];

  return (
    <FormProvider {...form}>
      <View className="flex-1 gap-y-6">
        {/* Avatar Section */}
        <View className="items-center">
          <FormElements.AvatarField name="avatar" control={control} />
        </View>

        {/* Personal Information */}
        <View className="gap-y-4">
          <View className="flex-row items-start gap-x-4">
            <View className="flex-1">
              <FormElements.TextField control={control} name="first_name" placeholder={t("placeholders:firstName")} />
            </View>
            <View className="flex-1">
              <FormElements.TextField control={control} name="last_name" placeholder={t("placeholders:lastName")} />
            </View>
          </View>

          <FormElements.EmailField control={control} name="email" placeholder={t("placeholders:email")} />

          <View className="flex-row items-start gap-x-4">
            <View className="flex-1">
              <FormElements.SelectField
                control={control}
                name="gender"
                placeholder={t("placeholders:gender")}
                options={genderOptions}
              />
            </View>
            <View className="flex-1">
              <FormElements.DatePickerField control={control} name="dob" />
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View className="gap-y-4">
          <FormElements.SelectField
            control={control}
            name="language"
            placeholder={t("language:languageTitle")}
            options={languageOptions}
          />
        </View>

        {/* Submit Button */}
        <FormElements.SubmitButton
          isDisabled={!formState.isValid}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isLoading}
          title={t("buttons:confirm")}
        />
      </View>
    </FormProvider>
  );
}
