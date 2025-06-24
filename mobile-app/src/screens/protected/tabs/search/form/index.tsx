import type React from "react";
import { View } from "react-native";

import { useTranslation } from "@/hooks";

import { LicensePlateField, SubmitButton } from "@/components/form-elements";

import { LicensePlatePicker } from "@/components/common";
import type { LicensePlateType } from "@/lib/constants";
import { Controller, FormProvider } from "react-hook-form";
import useVehiclePlateForm from "./hook";
import type { SearchVehiclePlateFormData } from "./schema";

interface ISearchVehiclePlateForm {
  initialData?: Partial<unknown> | null;
  onSubmit: (args: SearchVehiclePlateFormData) => void;
}

const SearchVehiclePlateForm: React.FC<ISearchVehiclePlateForm> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const { type, setType, resetForm, ...formMethods } = useVehiclePlateForm(initialData);

  const onSubmitFull = (data: Omit<SearchVehiclePlateFormData, "type">) => {
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
          title={t("buttons:search")}
          isDisabled={!formMethods.formState.isValid}
          onSubmit={formMethods.handleSubmit(onSubmitFull)}
          isSubmitting={formMethods.formState.isSubmitting}
        />
      </View>
    </FormProvider>
  );
};

export default SearchVehiclePlateForm;
