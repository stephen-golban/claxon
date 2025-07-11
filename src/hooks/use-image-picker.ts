import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Dimensions, Platform } from "react-native";
import { toast } from "@/components/ui/toast";

export function useImagePick() {
	const [uploading, setUploading] = useState(false);

	// Get the screen width for dynamic resizing
	const SCREEN_WIDTH = Dimensions.get("window").width;

	const pickImage = async () => {
		try {
			setUploading(true);

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsMultipleSelection: false,
				allowsEditing: true,
				quality: 1, // Pick at highest quality
				exif: false,
			});

			if (result.canceled || !result.assets || result.assets.length === 0) {
				console.log("User cancelled image picker.");
				return;
			}

			const image = result.assets[0];
			if (!image.uri) {
				throw new Error("No image URI found!");
			}

			// Determine optimal width for mobile (adaptive sizing)
			const MAX_WIDTH = SCREEN_WIDTH > 800 ? 800 : 600;

			// Optimize image
			const manipulatedImage = await manipulateAsync(
				image.uri,

				[{ resize: { width: MAX_WIDTH } }],
				{
					compress: Platform.OS === "ios" ? 0.7 : 0.6, // Slightly lower quality on Android for better compression
					format: SaveFormat.JPEG, // Ensure JPEG format
				},
			);

			const optimizedUri = manipulatedImage.uri as string;
			const path = `${Date.now()}.jpeg`;

			// Fetch optimized image as an ArrayBuffer (for uploading)
			const arraybuffer = await fetch(optimizedUri).then((res) =>
				res.arrayBuffer(),
			);

			const mimeType = image.mimeType ?? "image/jpeg";

			return { path, arraybuffer, uri: optimizedUri, mimeType };
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);

				toast.error(error.message);
			} else {
				throw error;
			}
		} finally {
			setUploading(false);
		}
	};

	return { pickImage, uploading };
}
