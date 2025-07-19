import type React from "react";
import { Controller, FormProvider } from "react-hook-form";
import { View } from "react-native";
import { LicensePlatePicker } from "@/components/common";
import { LicensePlateField, SubmitButton } from "@/components/form-elements";
import { useTranslation } from "@/hooks";
import type { LicensePlateType } from "@/lib/constants";
import useVehiclePlateForm from "./hook";
import type { LicensePlateFormData } from "./schema";

interface ILicensePlateForm {
  isLoading?: boolean;
  buttonTitle?: string;
  initialData?: Partial<unknown> | null;
  onSubmit: (args: LicensePlateFormData) => void;
}

const LicensePlateForm: React.FC<ILicensePlateForm> = ({ onSubmit, initialData, buttonTitle, isLoading }) => {
  const { t } = useTranslation();
  const { type, setType, resetForm, ...formMethods } = useVehiclePlateForm(initialData);

  const onSubmitFull = (data: Omit<LicensePlateFormData, "type">) => {
    onSubmit({ ...data, type });
  };

  const handleTypeChange = (type: LicensePlateType) => {
    setType(type);
    resetForm();
  };

  return (
    <FormProvider {...formMethods}>
      <View className="flex-1 gap-y-5">
        <LicensePlatePicker onTypeChange={handleTypeChange} type={type}>
          <Controller
            name="plate"
            control={formMethods.control}
            render={({ field }) => (
              <LicensePlateField
                type={type}
                left={field.value.left}
                right={field.value.right}
                onLeftChange={(txt) => field.onChange({ ...field.value, left: txt })}
                onRightChange={(txt) => field.onChange({ ...field.value, right: txt })}
              />
            )}
          />
        </LicensePlatePicker>
        <SubmitButton
          title={buttonTitle || t("buttons:search")}
          isDisabled={!formMethods.formState.isValid}
          onSubmit={formMethods.handleSubmit(onSubmitFull)}
          isSubmitting={formMethods.formState.isSubmitting || isLoading}
        />
      </View>
    </FormProvider>
  );
};

export default LicensePlateForm;

export type { LicensePlateFormData };
