import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, Smartphone } from "lucide-react-native";
import React from "react";
import { useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm, useWatch, type Control } from "react-hook-form";
import { View } from "react-native";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks";
import type { Json } from "@/typings/database";
import {
  type NotificationPreferencesFormData,
  notificationPreferencesSchema,
  transformPreferencesToFormData,
} from "./schema";
import { hasNotificationPreferencesChanged } from "./util";

interface INotificationPreferencesForm {
  isSubmitting: boolean;
  onSubmit: (data: NotificationPreferencesFormData) => void;
  initialData: Json | undefined;
}

type NotificationFieldPath =
  | "sms.claxons"
  | "sms.directMessages"
  | "push.newClaxons"
  | "push.directMessages"
  | "push.appUpdates";

// Isolated component for individual notification toggles to prevent re-renders
const NotificationToggle = React.memo<{
  control: Control<NotificationPreferencesFormData>;
  fieldPath: NotificationFieldPath;
  title: string;
  description: string;
  isSubmitting: boolean;
  onFieldChange: (fieldPath: NotificationFieldPath, value: boolean) => void;
}>(({ control, fieldPath, title, description, isSubmitting, onFieldChange }) => {
  // Only watch this specific field to isolate re-renders
  const fieldValue = useWatch({
    control,
    name: fieldPath,
    defaultValue: false,
  });

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="font-medium">{title}</Text>
        <Text className="text-sm text-muted-foreground">{description}</Text>
      </View>
      <Switch
        checked={fieldValue}
        onCheckedChange={(checked) => onFieldChange(fieldPath, checked)}
        disabled={isSubmitting}
      />
    </View>
  );
});

// Isolated section component to prevent cross-section re-renders
const NotificationSection = React.memo<{
  control: Control<NotificationPreferencesFormData>;
  section: "sms" | "push";
  title: string;
  description: string;
  icon: React.ReactNode;
  isSubmitting: boolean;
  onFieldChange: (fieldPath: NotificationFieldPath, value: boolean) => void;
}>(({ control, section, title, description, icon, isSubmitting, onFieldChange }) => {
  const sectionFields =
    section === "sms"
      ? [
          { key: "claxons", title: "Receive SMS Claxons", description: "Get notified when someone sends you a claxon" },
          {
            key: "directMessages",
            title: "Direct Messages",
            description: "SMS notifications for direct messages from other users",
          },
        ]
      : [
          { key: "newClaxons", title: "New Claxons", description: "Push notifications when you receive new claxons" },
          {
            key: "directMessages",
            title: "Direct Messages",
            description: "Push notifications for direct messages from other users",
          },
          { key: "appUpdates", title: "App Updates", description: "Notifications about app updates and new features" },
        ];

  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center gap-x-3">
          {icon}
          <CardTitle>{title}</CardTitle>
        </View>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="gap-y-4">
        {sectionFields.map((field, index) => (
          <View key={field.key}>
            <NotificationToggle
              control={control}
              fieldPath={`${section}.${field.key}` as NotificationFieldPath}
              title={field.title}
              description={field.description}
              isSubmitting={isSubmitting}
              onFieldChange={onFieldChange}
            />
            {index < sectionFields.length - 1 && <Separator />}
          </View>
        ))}
      </CardContent>
    </Card>
  );
});

const NotificationPreferencesForm: React.FC<INotificationPreferencesForm> = ({
  onSubmit,
  isSubmitting,
  initialData,
}) => {
  const { isDark } = useColorScheme();

  // Transform initial data to form data format
  const formDefaultValues = transformPreferencesToFormData(initialData);

  const resolver = zodResolver(notificationPreferencesSchema);

  const hook = useForm<NotificationPreferencesFormData>({
    resolver,
    defaultValues: formDefaultValues,
    mode: "onChange",
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

  // Optimized change handler that submits immediately on field change
  const handleFieldChange = useCallback(
    async (fieldPath: NotificationFieldPath, value: boolean) => {
      // Update the field value
      hook.setValue(fieldPath, value);

      // Get current form values after the change
      const currentValues = hook.getValues();

      // Check if form has changes from original values
      if (originalValuesRef.current && hasNotificationPreferencesChanged(originalValuesRef.current, currentValues)) {
        const isValid = await hook.trigger();
        if (isValid) {
          onSubmit(currentValues);
        }
      }
    },
    [hook, onSubmit],
  );

  return (
    <FormProvider {...hook}>
      <View className="gap-y-6">
        {/* SMS Notifications Section */}
        <NotificationSection
          control={hook.control}
          section="sms"
          title="SMS Notifications"
          description="Receive notifications via text message to your phone"
          icon={<MessageSquare size={20} color={isDark ? "#ffffff" : "#000000"} />}
          isSubmitting={isSubmitting}
          onFieldChange={handleFieldChange}
        />

        {/* Push Notifications Section */}
        <NotificationSection
          control={hook.control}
          section="push"
          title="Push Notifications"
          description="Receive notifications directly to your device"
          icon={<Smartphone size={20} color={isDark ? "#ffffff" : "#000000"} />}
          isSubmitting={isSubmitting}
          onFieldChange={handleFieldChange}
        />
      </View>
    </FormProvider>
  );
};

export default NotificationPreferencesForm;
