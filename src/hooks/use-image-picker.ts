import * as FileSystem from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
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
      const MAX_SIZE = SCREEN_WIDTH > 800 ? 800 : 600;

      // Optimize image
      const context = ImageManipulator.manipulate(image.uri);
      const rendered = await context.resize({ width: MAX_SIZE, height: MAX_SIZE }).renderAsync();
      const imageResult = await rendered.saveAsync({
        format: SaveFormat.PNG,
        compress: Platform.OS === "ios" ? 0.7 : 0.6,
      });

      const uri = imageResult.uri;
      const fileName = `${Date.now()}.png`;
      const mimeType = image.mimeType ?? "image/png";
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      return { fileName, uri, mimeType, base64 };
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
