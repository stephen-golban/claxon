import { Image } from "expo-image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useQueryImage } from "@/services/api/image";
import LoadingSkeleton from "./loading-skeleton";
import { getInitials, SKELETON_CLASSES } from "./util";

interface ProfileAvatarProps {
	isLoading: boolean;
	first_name: string | null;
	last_name: string | null;
	bucket_avatar_url: string | null;
}

const ProfileAvatar = memo<ProfileAvatarProps>(
	({ first_name, last_name, bucket_avatar_url, isLoading }) => {
    const [hasLoaded, setHasLoaded] = useState(false);
		const { downloadMutation, isDownloading, downloadedImagePath } =
			useQueryImage("profile-avatar");

		useEffect(() => {
			if (bucket_avatar_url) {
				downloadMutation.mutateAsync(bucket_avatar_url);
			}
		}, [bucket_avatar_url, downloadMutation]);

		// Memoize initials calculation - only recalculate when name data changes
		const initials = useMemo(() => {
			return getInitials(first_name, last_name);
		}, [first_name, last_name]);

		// Reset hasLoaded when avatar URL changes
		useEffect(() => {
			setHasLoaded(false);
		}, [downloadedImagePath]);

		// Memoized callback to prevent function recreation on every render
		const handleImageLoad = useCallback(() => {
			setHasLoaded(true);
		}, []);

		// Early returns for loading and empty states
		if (isLoading || isDownloading) {
			return <LoadingSkeleton />;
		}

		if (!first_name || !last_name) {
			return null;
		}

		return (
			<Avatar alt="Profile Avatar">
				{!hasLoaded && downloadedImagePath && (
					<View style={styles.loadingOverlay}>
						<Skeleton className={SKELETON_CLASSES} />
					</View>
				)}
				{downloadedImagePath && (
					<Image
						priority="high"
						transition={1000}
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
	},
);

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
