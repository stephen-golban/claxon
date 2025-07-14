import { Image } from "expo-image";
import { isEmpty } from "lodash";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useGetMe } from "@/services/api/accounts";
import { useQueryImage } from "@/services/api/image";
import LoadingSkeleton from "./loading-skeleton";
import { getInitials, SKELETON_CLASSES } from "./util";

const ProfileAvatar = memo(() => {
  const me = useGetMe();
  const [hasLoaded, setHasLoaded] = useState(false);
  const { downloadMutation, isDownloading, downloadedImagePath } = useQueryImage("profile-avatar");

  // Check if user has avatar URL set
  const hasAvatarUrl = !isEmpty(me.data?.avatar_url);

  useEffect(() => {
    if (hasAvatarUrl && me.data?.avatar_url) {
      downloadMutation.mutateAsync(me.data.avatar_url);
    }
  }, [me.data?.avatar_url, downloadMutation, hasAvatarUrl]);

  // Memoize initials calculation - only recalculate when name data changes
  const initials = useMemo(() => {
    return getInitials(me.data?.first_name ?? null, me.data?.last_name ?? null);
  }, [me.data?.first_name, me.data?.last_name]);

  // Reset hasLoaded when avatar URL changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: downloadedImagePath is needed
  useEffect(() => {
    setHasLoaded(false);
  }, [downloadedImagePath]);

  // Memoized callback to prevent function recreation on every render
  const handleImageLoad = useCallback(() => {
    setHasLoaded(true);
  }, []);

  // Show loading skeleton only when user data is loading
  if (me.isLoading || me.isPending) {
    return <LoadingSkeleton />;
  }

  // Show image loading state only when downloading avatar
  const showImageLoading = hasAvatarUrl && isDownloading;

  return (
    <Avatar alt="Profile Avatar" className="h-12 w-12">
      {showImageLoading && (
        <View style={styles.loadingOverlay}>
          <Skeleton className={SKELETON_CLASSES} />
        </View>
      )}
      {!hasLoaded && downloadedImagePath && (
        <View style={styles.loadingOverlay}>
          <Skeleton className={SKELETON_CLASSES} />
        </View>
      )}
      {downloadedImagePath && (
        <Image
          priority="high"
          transition={300}
          style={styles.image}
          cachePolicy="memory-disk"
          source={{ uri: downloadedImagePath }}
          onLoadEnd={handleImageLoad}
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});

export { ProfileAvatar };
