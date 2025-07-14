import { Image } from "expo-image";
import { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useGetMe } from "@/services/api/accounts";
import { useDownloadImage } from "@/services/api/image";
import LoadingSkeleton from "./loading-skeleton";
import { getInitials } from "./util";

// Default blur hash for avatar placeholder
const DEFAULT_AVATAR_BLURHASH =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const ProfileAvatar = memo(() => {
  const me = useGetMe();

  // Memoize the avatar URL to prevent unnecessary effect triggers
  const avatarUrl = useMemo(() => me.data?.avatar_url, [me.data?.avatar_url]);

  // Use the optimized query hook for automatic caching and request deduplication
  const imageQuery = useDownloadImage(avatarUrl, "profile-avatar", 64);

  // Memoize initials calculation - only recalculate when name data changes
  const initials = useMemo(() => {
    return getInitials(me.data?.first_name ?? null, me.data?.last_name ?? null);
  }, [me.data?.first_name, me.data?.last_name]);

  // Memoize the image source to prevent unnecessary re-renders
  const imageSource = useMemo(() => {
    return imageQuery.data ? { uri: imageQuery.data } : null;
  }, [imageQuery.data]);

  // Show loading skeleton only when user data is loading for the first time
  // Don't show loading for image refetches to prevent flickering
  if (me.isLoading || me.isPending || (imageQuery.isLoading && !imageQuery.data)) {
    return <LoadingSkeleton />;
  }

  return (
    <Avatar alt="Profile Avatar" className="h-12 w-12">
      {imageSource && (
        <Image
          priority="high"
          transition={1000}
          style={styles.image}
          cachePolicy="memory-disk"
          source={imageSource}
          placeholder={{ blurhash: DEFAULT_AVATAR_BLURHASH }}
          contentFit="cover"
        />
      )}
      <AvatarFallback>
        <Text>{initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
  },
});

export { ProfileAvatar };
