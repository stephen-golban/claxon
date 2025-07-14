import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useGetMe } from "@/services/api/accounts";
import { getLanguageDisplayName, getLanguageOptions } from "../language-utils";
import { type AccountFormData, accountFormSchema, transformAccountToFormData } from "./schema";

interface IAccountForm {
  isSubmitting: boolean;
  onPhoneToggle: (enabled: boolean) => void;
  onLanguageChange: (language: "en" | "ro" | "ru") => void;
  onNotificationSettings: () => void;
}

const AccountForm: React.FC<IAccountForm> = ({
  onPhoneToggle,
  onLanguageChange,
  isSubmitting,
  onNotificationSettings,
}) => {
  const { data: accountData } = useGetMe();

  // Track the width of the language select trigger for consistent dropdown width
  const [languageSelectWidth, setLanguageSelectWidth] = useState(0);

  // Transform account data to form data format
  const formDefaultValues = transformAccountToFormData(accountData);

  const resolver = zodResolver(accountFormSchema);

  const hook = useForm<AccountFormData>({
    resolver,
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  // Reset form values when account data becomes available
  useEffect(() => {
    if (accountData) {
      const newFormData = transformAccountToFormData(accountData);
      hook.reset(newFormData);
    }
  }, [accountData, hook]);

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
              onCheckedChange={(checked) => {
                hook.setValue("is_phone_public", checked);
                onPhoneToggle(checked);
              }}
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
          <Separator />
          <View className="gap-y-3">
            <View className="flex-1">
              <Text className="font-medium">App Language</Text>
              <Text className="text-sm text-muted-foreground">
                Choose your preferred language for the app interface
              </Text>
            </View>
            <View onLayout={(event) => setLanguageSelectWidth(event.nativeEvent.layout.width)}>
              <Select
                value={{
                  value: hook.watch("language"),
                  label: getLanguageDisplayName(hook.watch("language")),
                }}
                onValueChange={(option) => {
                  if (typeof option === "object" && option?.value) {
                    const newLanguage = option.value as "en" | "ro" | "ru";
                    hook.setValue("language", newLanguage);
                    onLanguageChange(newLanguage);
                  }
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent sideOffset={8} style={{ width: languageSelectWidth }}>
                  {getLanguageOptions().map((option, idx) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      style={{
                        borderTopRightRadius: idx === 0 ? 16 : 0,
                        borderTopLeftRadius: idx === 0 ? 16 : 0,
                        borderBottomRightRadius: idx === getLanguageOptions().length - 1 ? 16 : 0,
                        borderBottomLeftRadius: idx === getLanguageOptions().length - 1 ? 16 : 0,
                      }}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>
          </View>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default AccountForm;
