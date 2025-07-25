import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CarIcon, UploadIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { useErrorMessageTranslation, useImagePick, useTranslation } from "@/hooks";
import { cn } from "@/lib/utils";
import { useDownloadImage } from "@/services/api/image";
import { FieldError } from "../field-error";

type ImageData = {
  uri: string;
  base64: string;
  fileName: string;
  mimeType: string;
};

export interface BaseAvatarFieldProps {
  value: ImageData;
  size?: number;
  error?: string;
  label?: string;
  existingAvatarUrl?: string | null;
  onBlur: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: any is used to allow for any type of event
  onChange: (...event: any[]) => void;
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const BaseAvatarField = React.forwardRef<React.ComponentRef<typeof TouchableOpacity>, BaseAvatarFieldProps>(
  ({ value, onChange, onBlur, error, size = 80, label, existingAvatarUrl, ...rest }, ref) => {
    const { pickImage } = useImagePick();

    const { t } = useTranslation();
    const errorMessage = useErrorMessageTranslation(error);

    // Download existing avatar if available
    const existingAvatarQuery = useDownloadImage(existingAvatarUrl, "avatar-field", 80);

    async function handlePickImage() {
      const result = await pickImage();

      if (!result) {
        return;
      }

      onChange(result);
      return;
    }

    // Determine if we have a value - either a new image or an existing avatar
    const hasNewImage = typeof value === "object" ? !!value?.uri : !!value;
    const hasExistingAvatar = !!existingAvatarQuery.data;
    const hasValue = hasNewImage || hasExistingAvatar;

    // Determine which image source to use - prioritize new image over existing
    const imageSource = hasNewImage ? value?.uri : existingAvatarQuery.data;

    const renderCarPhotoPreview = () => {
      if (hasValue && imageSource) {
        return (
          <View className="relative">
            <View className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/20">
              <Image
                transition={300}
                contentFit="cover"
                placeholder={{ blurhash }}
                cachePolicy="memory-disk"
                source={{ uri: imageSource }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
            {/* Success indicator - only show when upload is complete or has new image */}
            {hasNewImage && (
              <View className="absolute -top-1 -right-1">
                <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center border-2 border-background">
                  <Text className="text-xs text-white font-bold">✓</Text>
                </View>
              </View>
            )}
          </View>
        );
      }

      return (
        <View
          className={cn(
            "w-20 h-20 rounded-xl border-2 border-dashed items-center justify-center",
            "bg-muted/30 border-muted-foreground/30",
            error && "border-destructive bg-destructive/5",
          )}
        >
          <CarIcon size={24} className={cn("text-muted-foreground", error && "text-destructive")} />
        </View>
      );
    };

    return (
      <View className="gap-y-2">
        {label && (
          <Text className="text-lg font-medium text-foreground">
            {label} <Text className="text-destructive">*</Text>
          </Text>
        )}
        <TouchableOpacity
          ref={ref}
          className={cn(
            "p-4 rounded-2xl border border-transparent bg-transparent-black dark:bg-transparent-white",
            "active:opacity-80 transition-opacity",
            error && "bg-destructive/10",
          )}
          onPress={handlePickImage}
          onBlur={onBlur}
          activeOpacity={0.7}
          {...rest}
        >
          <View className="flex-row items-center gap-x-4">
            {renderCarPhotoPreview()}

            <View className="flex-1 gap-y-1">
              <Text
                className={cn(
                  "text-base font-medium",
                  hasValue ? "text-primary" : "text-foreground",
                  error && "text-destructive",
                )}
              >
                {hasNewImage
                  ? t("avatar:success_tip")
                  : hasExistingAvatar
                    ? t("avatar:change_tip")
                    : t("avatar:initial_tip")}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {hasValue ? t("avatar:change_tip2") : t("avatar:initial_tip2")}
              </Text>
            </View>

            <View className="items-center">
              {hasValue ? (
                <Badge variant="secondary" className="px-2 py-1">
                  <Text className="text-xs">{t("buttons:change")}</Text>
                </Badge>
              ) : (
                <View
                  className={cn(
                    "w-8 h-8 rounded-full items-center justify-center",
                    "bg-primary/10 border border-primary/20",
                    error && "bg-destructive/10 border-destructive/20",
                  )}
                >
                  <UploadIcon size={16} className={cn("text-primary", error && "text-destructive")} />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {errorMessage && <FieldError message={errorMessage} />}
      </View>
    );
  },
);

BaseAvatarField.displayName = "BaseAvatarField";

export default BaseAvatarField;
