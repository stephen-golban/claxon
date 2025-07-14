import { useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import type React from "react";

import { SwitchField, SubmitButton } from "@/components/form-elements";
import { MessageSquareIcon, SmartphoneIcon } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Json } from "@/typings/database";

import { type NotificationPreferencesFormData, resolver, transformPreferencesToFormData } from "./schema";
import { hasNotificationPreferencesChanged } from "./util";

interface INotificationPreferencesForm {
  onSubmit: (data: NotificationPreferencesFormData) => Promise<void>;
  initialData: Json | undefined;
}

const NotificationPreferencesForm: React.FC<INotificationPreferencesForm> = ({ onSubmit, initialData }) => {
  // Transform initial data to form data format
  const formDefaultValues = transformPreferencesToFormData(initialData);

  const hook = useForm<NotificationPreferencesFormData>({
    resolver,
    mode: "onChange",
    defaultValues: formDefaultValues,
  });

  // Store original values for change detection
  const originalValuesRef = useRef<NotificationPreferencesFormData | null>(null);

  // Reset form values when initial data becomes available
  useEffect(() => {
    if (initialData !== undefined) {
      const newFormData = transformPreferencesToFormData(initialData);
      hook.reset(newFormData);
      // Store the original values for change detection
      originalValuesRef.current = newFormData;
    }
  }, [initialData, hook]);

  // Watch all form values to detect changes
  const currentFormValues = hook.watch();

  // Check if form has changes from original values
  const hasChanges = useMemo(() => {
    if (!originalValuesRef.current) {
      return false;
    }
    return hasNotificationPreferencesChanged(originalValuesRef.current, currentFormValues);
  }, [currentFormValues]);

  // Custom submit handler that updates original values after successful submission
  const handleSubmit = async (data: NotificationPreferencesFormData) => {
    await onSubmit(data);
    // Update original values to current values after successful submission
    originalValuesRef.current = data;
  };

  return (
    <FormProvider {...hook}>
      <View className="gap-y-6">
        {/* SMS Notifications Section */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-x-3">
              <MessageSquareIcon size={20} />
              <CardTitle>SMS Notifications</CardTitle>
            </View>
            <CardDescription>Receive notifications via text message to your phone</CardDescription>
          </CardHeader>
          <CardContent className="gap-y-4">
            <SwitchField
              name="sms.claxons"
              label="Receive SMS Claxons"
              description="Get notified when someone sends you a claxon"
            />
            <Separator />
            <SwitchField
              name="sms.directMessages"
              label="Direct Messages"
              description="SMS notifications for direct messages from other users"
            />
          </CardContent>
        </Card>

        {/* Push Notifications Section */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-x-3">
              <SmartphoneIcon size={20} />
              <CardTitle>Push Notifications</CardTitle>
            </View>
            <CardDescription>Receive notifications directly to your device</CardDescription>
          </CardHeader>
          <CardContent className="gap-y-4">
            <SwitchField
              name="push.newClaxons"
              label="New Claxons"
              description="Push notifications when you receive new claxons"
            />
            <Separator />
            <SwitchField
              name="push.directMessages"
              label="Direct Messages"
              description="Push notifications for direct messages from other users"
            />
            <Separator />
            <SwitchField
              name="push.appUpdates"
              label="App Updates"
              description="Notifications about app updates and new features"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <SubmitButton
          isDisabled={!hook.formState.isValid || !hasChanges}
          onSubmit={hook.handleSubmit(handleSubmit)}
          isSubmitting={hook.formState.isSubmitting}
          title="Save Preferences"
        />
      </View>
    </FormProvider>
  );
};

export default NotificationPreferencesForm;
