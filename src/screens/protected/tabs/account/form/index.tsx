import type React from "react";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Option, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useGetMe } from "@/services/api/accounts";
import { getLanguageDisplayName, getLanguageOptions } from "../language-utils";
import { BaseSwitchField } from "@/components/form-elements";
import { noop } from "lodash";

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
  const [selectedLanguage, setSelectedLanguage] = useState(accountData?.language || "ro");
  const [isPhonePublic, setIsPhonePublic] = useState(accountData?.is_phone_public || false);

  const handlePhoneToggle = (checked: boolean) => {
    setIsPhonePublic(checked);
    onPhoneToggle(checked);
  };

  const handleLanguageChange = (option: Option) => {
    if (typeof option === "object" && option?.value) {
      const newLanguage = option.value as "en" | "ro" | "ru";
      setSelectedLanguage(newLanguage);
      onLanguageChange(newLanguage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control your privacy and data sharing</CardDescription>
      </CardHeader>
      <CardContent className="gap-y-4">
        <BaseSwitchField
          onBlur={noop}
          value={isPhonePublic}
          label="Share Phone Number"
          onChange={handlePhoneToggle}
          description="Allow other users to see your phone number"
        />
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-medium">Share Phone Number</Text>
            <Text className="text-sm text-muted-foreground">Allow other users to see your phone number</Text>
          </View>
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
            <Text className="text-sm text-muted-foreground">Choose your preferred language for the app interface</Text>
          </View>
          <View onLayout={(event) => setLanguageSelectWidth(event.nativeEvent.layout.width)}>
            <Select
              value={{
                value: selectedLanguage,
                label: getLanguageDisplayName(selectedLanguage),
              }}
              disabled={isSubmitting}
              onValueChange={handleLanguageChange}
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
  );
};

export default AccountForm;
