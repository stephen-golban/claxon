import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { LicensePlatePicker } from "@/components/common";
import * as FormElements from "@/components/form-elements";
import { LicensePlateField } from "@/components/form-elements/license-plate";
import { Text } from "@/components/ui/text";
import type { LicensePlateType } from "@/lib/constants";
import type { Vehicle } from "@/services/api/vehicles";
import { createDefaultValues, createResolver, type UpsertLicensePlateFormData } from "./schema";

interface IUpsertLicensePlateForm {
  onSubmit: (data: UpsertLicensePlateFormData) => void;
  initialData?: Vehicle;
}

const UpsertLicensePlateForm: React.FC<IUpsertLicensePlateForm> = ({ onSubmit, initialData }) => {
  const defaultValues = createDefaultValues(initialData);
  const [plateType, setPlateType] = useState<LicensePlateType>(defaultValues.plate_type as LicensePlateType);

  const hook = useForm<UpsertLicensePlateFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(createResolver(plateType)),
  });

  const handleTypeChange = (type: LicensePlateType) => {
    setPlateType(type);
    hook.setValue("plate_type", type);
    // Reset plate values when type changes
    hook.setValue("plate.left", "");
    hook.setValue("plate.right", "");
    // Update the resolver for the new plate type
    hook.clearErrors();
  };

  console.log(hook.getValues());

  return (
    <FormProvider {...hook}>
      <View className="flex-1 gap-y-5">
        <View>
          <Text className="text-sm font-medium mb-4">Select your license plate type and enter the details</Text>

          <LicensePlatePicker type={plateType} onTypeChange={handleTypeChange}>
            <Controller
              control={hook.control}
              name="plate"
              render={({ field }) => (
                <LicensePlateField
                  type={plateType}
                  left={field.value.left}
                  right={field.value.right}
                  onLeftChange={(txt) => field.onChange({ ...field.value, left: txt })}
                  onRightChange={(txt) => field.onChange({ ...field.value, right: txt })}
                />
              )}
            />
          </LicensePlatePicker>
        </View>

        <FormElements.SubmitButton
          isDisabled={!hook.formState.isValid}
          onSubmit={hook.handleSubmit(onSubmit)}
          isSubmitting={hook.formState.isSubmitting}
          title="Complete Vehicle Setup"
        />
      </View>
    </FormProvider>
  );
};

export default UpsertLicensePlateForm;
