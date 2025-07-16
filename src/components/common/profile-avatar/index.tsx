import { useRouter } from "expo-router";
import { memo, useMemo } from "react";
import { Pressable } from "react-native";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import type { Account } from "@/services/api/accounts";
import { useDownloadImage } from "@/services/api/image";
import ProfileAvatarImg from "./avatar-img";
import LoadingSkeleton from "./loading-skeleton";
import { getInitials } from "./util";

interface IProfileAvatar extends Pick<Account, "avatar_url" | "first_name" | "last_name"> {
  isMeLoading: boolean;
}

const ProfileAvatar = memo(({ avatar_url, first_name, last_name, isMeLoading }: IProfileAvatar) => {
  const router = useRouter();
  const imageQuery = useDownloadImage(avatar_url, "profile-avatar", 64);

  // Memoize initials calculation - only recalculate when name data changes
  const initials = useMemo(() => {
    return getInitials(first_name ?? null, last_name ?? null);
  }, [first_name, last_name]);

  // Memoize the image source to prevent unnecessary re-renders
  const imageSource = useMemo(() => {
    return imageQuery.data ? { uri: imageQuery.data } : null;
  }, [imageQuery.data]);

  // Show loading skeleton only when user data is loading for the first time
  // Don't show loading for image refetches to prevent flickering
  if (isMeLoading || (imageQuery.isLoading && !imageQuery.data)) {
    return <LoadingSkeleton />;
  }

  return (
    <Pressable onPress={() => router.push("/(protected)/account")}>
      <Avatar alt="Profile Avatar" className="h-12 w-12">
        {imageSource && <ProfileAvatarImg uri={imageSource.uri} />}
        <AvatarFallback>
          <Text>{initials}</Text>
        </AvatarFallback>
      </Avatar>
    </Pressable>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";

export { ProfileAvatar };
