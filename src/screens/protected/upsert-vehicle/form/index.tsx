import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import * as FormElements from "@/components/form-elements";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { defaultValues, type UpsertVehicleFormData, upsertVehicleSchema } from "./schema";
import { hasFormDataChanged } from "./util";

interface IUpsertVehicleForm {
  onSubmit: (data: UpsertVehicleFormData) => void;
  initialData?: UpsertVehicleFormData;
}

const UpsertVehicleForm: React.FC<IUpsertVehicleForm> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();

  // Use provided initial data or default values
  const formDefaultValues = initialData || defaultValues;

  const hook = useForm<UpsertVehicleFormData>({
    resolver: zodResolver(upsertVehicleSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  // Store original values for change detection
  const originalValuesRef = useRef<UpsertVehicleFormData | null>(null);

  // Set original values when component mounts
  useEffect(() => {
    originalValuesRef.current = formDefaultValues;
  }, [formDefaultValues]);

  // Watch all form values to detect changes
  const currentFormValues = hook.watch();

  // Check if form has changes from original values (for new vehicles, always allow submission when valid)
  const hasChanges = useMemo(() => {
    if (!originalValuesRef.current) {
      return true; // Allow submission for new forms
    }
    // For new vehicles (no initial data), always allow submission when form is valid
    if (!initialData) {
      return true;
    }
    return hasFormDataChanged(originalValuesRef.current, currentFormValues);
  }, [currentFormValues, initialData]);

  return (
    <FormProvider {...hook}>
      <View className="flex-1 gap-y-4 mt-5">
        {/* Brand and Model */}
        <View className="flex-row items-start gap-x-4">
          <View className="flex-1">
            <FormElements.TextField
              control={hook.control}
              name="brand"
              placeholder={t("placeholders:brand")}
              label="Brand"
              autoCapitalize="words"
            />
          </View>
          <View className="flex-1">
            <FormElements.TextField
              control={hook.control}
              name="model"
              placeholder={t("placeholders:model")}
              label="Model"
              autoCapitalize="words"
            />
          </View>
        </View>

        <View className="gap-y-4 flex-1">
          {/* Manufacture Year */}
          <View>
            <FormElements.TextField
              control={hook.control}
              name="manufacture_year"
              placeholder={t("placeholders:manufactureYear")}
              label="Year"
              keyboardType="numeric"
            />
          </View>

          {/* Color */}
          <View>
            <FormElements.ColorSelectField control={hook.control} name="color" label="Color" />
          </View>

          {/* VIN Code */}
          <View>
            <FormElements.TextField
              control={hook.control}
              name="vin_code"
              placeholder={t("placeholders:vinCode")}
              label="VIN Code"
              autoCapitalize="characters"
              maxLength={17}
            />
            <Text className="text-xs text-muted-foreground mt-1">Vehicle Identification Number (17 characters)</Text>
          </View>
        </View>
      </View>

      <FormElements.SubmitButton
        onSubmit={hook.handleSubmit(onSubmit)}
        isSubmitting={hook.formState.isSubmitting}
        isDisabled={!hook.formState.isValid || !hasChanges}
        title="Next"
      />
    </FormProvider>
  );
};

export default UpsertVehicleForm;
