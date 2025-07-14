import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, Smartphone } from "lucide-react-native";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
import { getSettingDescription, getSettingTitle, hasNotificationPreferencesChanged } from "./util";

interface INotificationPreferencesForm {
  isSubmitting: boolean;
  onSubmit: (data: NotificationPreferencesFormData) => void;
  initialData: Json | undefined;
}

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

  // Watch all form values to detect changes
  const currentFormValues = hook.watch();

  // Check if form has changes from original values
  const hasChanges = useMemo(() => {
    if (!originalValuesRef.current) {
      return false;
    }
    return hasNotificationPreferencesChanged(originalValuesRef.current, currentFormValues);
  }, [currentFormValues]);

  // Auto-submit when preferences change
  useEffect(() => {
    if (hasChanges && originalValuesRef.current) {
      const submitData = async () => {
        const isValid = await hook.trigger();
        if (isValid) {
          onSubmit(currentFormValues);
        }
      };
      submitData();
    }
  }, [hasChanges, currentFormValues, hook, onSubmit]);

  const renderNotificationSection = (
    section: "sms" | "push",
    title: string,
    description: string,
    icon: React.ReactNode,
  ) => {
    const sectionData = currentFormValues[section];
    const sectionKeys = Object.keys(sectionData) as Array<keyof typeof sectionData>;

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
          {sectionKeys.map((setting, index) => (
            <View key={setting}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-medium">{getSettingTitle(section, setting)}</Text>
                  <Text className="text-sm text-muted-foreground">{getSettingDescription(section, setting)}</Text>
                </View>
                <Switch
                  checked={sectionData[setting]}
                  onCheckedChange={(checked) => hook.setValue(`${section}.${setting}`, checked)}
                  disabled={isSubmitting}
                />
              </View>
              {index < sectionKeys.length - 1 && <Separator />}
            </View>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <FormProvider {...hook}>
      <View className="gap-y-6">
        {/* SMS Notifications Section */}
        {renderNotificationSection(
          "sms",
          "SMS Notifications",
          "Receive notifications via text message to your phone",
          <MessageSquare size={20} color={isDark ? "#ffffff" : "#000000"} />,
        )}

        {/* Push Notifications Section */}
        {renderNotificationSection(
          "push",
          "Push Notifications",
          "Receive notifications directly to your device",
          <Smartphone size={20} color={isDark ? "#ffffff" : "#000000"} />,
        )}
      </View>
    </FormProvider>
  );
};

export default NotificationPreferencesForm;
