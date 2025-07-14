import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useGetMe } from "@/services/api/accounts";
import { type AccountFormData, accountFormSchema, transformAccountToFormData } from "./schema";
import { hasFormDataChanged } from "./util";

interface IAccountForm {
  isSubmitting: boolean;
  onSubmit: (data: AccountFormData) => void;
  onNotificationSettings: () => void;
}

const AccountForm: React.FC<IAccountForm> = ({ onSubmit, isSubmitting, onNotificationSettings }) => {
  const { data: accountData } = useGetMe();

  // Transform account data to form data format
  const formDefaultValues = transformAccountToFormData(accountData);

  const resolver = zodResolver(accountFormSchema);

  const hook = useForm<AccountFormData>({
    resolver,
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  // Store original values for change detection
  const originalValuesRef = useRef<AccountFormData | null>(null);

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

  // Auto-submit when phone sharing changes
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

  return (
    <FormProvider {...hook}>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your privacy and data sharing</CardDescription>
        </CardHeader>
        <CardContent className="gap-y-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-medium">Share Phone Number</Text>
              <Text className="text-sm text-muted-foreground">Allow other users to see your phone number</Text>
            </View>
            <Switch
              checked={hook.watch("is_phone_public")}
              onCheckedChange={(checked) => hook.setValue("is_phone_public", checked)}
              disabled={isSubmitting}
            />
          </View>
          <Separator />
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-medium">Notification Preferences</Text>
              <Text className="text-sm text-muted-foreground">Manage how you receive notifications</Text>
            </View>
            <Button variant="outline" size="sm" onPress={onNotificationSettings}>
              <Text>Configure</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default AccountForm;
