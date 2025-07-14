import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { toast } from "@/components/ui/toast";

const getFileExt = (uri: string) => uri.split(".").pop()?.toLowerCase() ?? "jpeg";

export function useImagePick() {
  // Get the screen width for dynamic resizing
  const pickImage = async () => {
    try {
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
      const MAX_SIZE = 328;

      // Optimize image
      const context = ImageManipulator.manipulate(image.uri);
      const rendered = await context.resize({ width: MAX_SIZE, height: MAX_SIZE }).renderAsync();
      const imageResult = await rendered.saveAsync({
        format: SaveFormat.JPEG,
        compress: Platform.OS === "ios" ? 0.7 : 0.6,
      });

      const uri = imageResult.uri;
      const fileExt = getFileExt(uri);
      const path = `${Date.now()}.${fileExt}`;
      const mimeType = image.mimeType ?? "image/jpeg";
      const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());

      return { path, uri, mimeType, arraybuffer };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);

        toast.error(error.message);
      } else {
        throw error;
      }
    }
  };

  return { pickImage };
}
