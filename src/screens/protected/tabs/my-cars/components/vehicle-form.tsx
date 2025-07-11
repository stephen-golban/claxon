import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import { ColorSelectField, SubmitButton, TextField } from "@/components/form-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

const vehicleSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  manufacture_year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  color: z.string().min(1, "Color is required"),
  vin_code: z.string().min(17, "VIN code must be 17 characters").max(17, "VIN code must be 17 characters"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void;
  onCancel: () => void;
  initialData?: Partial<VehicleFormData>;
  isSubmitting?: boolean;
}

export function VehicleForm({ onSubmit, onCancel, initialData, isSubmitting = false }: VehicleFormProps) {
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: initialData?.brand || "",
      model: initialData?.model || "",
      manufacture_year: initialData?.manufacture_year || new Date().getFullYear(),
      color: initialData?.color || "",
      vin_code: initialData?.vin_code || "",
    },
    mode: "onChange",
  });

  const handleSubmit = (data: VehicleFormData) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          {/* Brand and Model */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-medium mb-2">Brand</Text>
              <TextField name="brand" placeholder="Enter brand" autoCapitalize="words" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium mb-2">Model</Text>
              <TextField name="model" placeholder="Enter model" autoCapitalize="words" />
            </View>
          </View>

          {/* Year */}
          <View>
            <Text className="text-sm font-medium mb-2">Year</Text>
            <TextField name="manufacture_year" placeholder="2024" keyboardType="numeric" />
          </View>

          {/* Color */}
          <View>
            <Text className="text-sm font-medium mb-2">Color</Text>
            <ColorSelectField name="color" placeholder="Select vehicle color" />
          </View>

          {/* VIN Code */}
          <View>
            <Text className="text-sm font-medium mb-2">VIN Code</Text>
            <TextField name="vin_code" placeholder="17 characters" autoCapitalize="characters" maxLength={17} />
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-4">
            <View className="flex-1">
              <Button variant="outline" onPress={onCancel} disabled={isSubmitting} className="rounded-full">
                <Text>Cancel</Text>
              </Button>
            </View>
            <View className="flex-1">
              <SubmitButton
                title="Save Vehicle"
                onSubmit={form.handleSubmit(handleSubmit)}
                isSubmitting={isSubmitting}
                isDisabled={!form.formState.isValid}
              />
            </View>
          </View>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
