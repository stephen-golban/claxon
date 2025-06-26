import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import { supabase } from "./client";

export type UploadImageProps = Partial<{
  path: string;
  arraybuffer: ArrayBuffer;
  mimeType: ImagePickerAsset["mimeType"];
}>;

export class ImageService {
  async downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from("avatars").download(path);

      if (error) {
        throw error;
      }

      let downloadedImage: string | null = null;

      if (data instanceof Blob) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          downloadedImage = fr.result as string;
        };
      }

      return downloadedImage;
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async uploadImage({ path, arraybuffer, mimeType }: UploadImageProps) {
    if (!path || !arraybuffer || !mimeType) {
      throw new Error("Path, arraybuffer and mimeType are required");
    }

    const { data, error } = await supabase.storage.from("avatars").upload(path, arraybuffer, {
      contentType: mimeType ?? "image/jpeg",
    });

    if (error) {
      throw error;
    }

    return data;
  }
}

export function useQueryImage(queryKey: string) {
  const service = new ImageService();
  const queryClient = useQueryClient();
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);

  const downloadImage = async (url: string) => await service.downloadImage(url);

  const uploadMutation = useMutation({
    mutationFn: service.uploadImage,
    mutationKey: ["image", queryKey],
    onSuccess: (data) => {
      setUploadedImagePath(data.path);
      queryClient.invalidateQueries({ queryKey: ["image", queryKey] });
    },
  });

  const isUploading = uploadMutation.isPending;

  return {
    isUploading,
    downloadImage,
    uploadMutation,
    uploadedImagePath,
  };
}
