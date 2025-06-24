import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import type { User } from "@/db/schema";
import { Image } from "expo-image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import LoadingSkeleton from "./loading-skeleton";
import { SKELETON_CLASSES, getInitials } from "./util";

interface ProfileAvatarProps {
  isLoading: boolean;
  data: User | null | undefined;
}

const ProfileAvatar = memo<ProfileAvatarProps>(({ data, isLoading }) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  const avatarUrl = useMemo(() => data?.avatarUrl, [data?.avatarUrl]);

  // Memoize initials calculation - only recalculate when name data changes
  const initials = useMemo(() => {
    if (!data) return "";
    return getInitials(data.firstName || undefined, data.lastName || undefined);
  }, [data]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset hasLoaded when avatar URL changes
  useEffect(() => {
    setHasLoaded(false);
  }, [avatarUrl]);

  // Memoized callback to prevent function recreation on every render
  const handleImageLoad = useCallback(() => {
    setHasLoaded(true);
  }, []);

  // Early returns for loading and empty states
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return null;
  }

  return (
    <Avatar alt="Profile Avatar">
      {!hasLoaded && avatarUrl && (
        <View style={styles.loadingOverlay}>
          <Skeleton className={SKELETON_CLASSES} />
        </View>
      )}
      {avatarUrl && (
        <Image
          priority="high"
          transition={1000}
          style={styles.image}
          cachePolicy="memory-disk"
          source={{ uri: avatarUrl }}
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
