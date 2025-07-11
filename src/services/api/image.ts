import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { ERROR_CODES } from "@/lib/constants";
import { printError, translateError } from "@/lib/utils";
import { supabase } from "./client";

export type UploadImageProps = Partial<{
  path: string;
  arraybuffer: ArrayBuffer;
  mimeType: ImagePickerAsset["mimeType"];
}>;

export class ImageService {
  async downloadImage(path: string) {
    const { data, error } = await supabase.storage.from("avatars").download(path);

    if (error) {
      printError(`image-download-error`, error);
      throw new Error(ERROR_CODES.DOWNLOAD_FAILED);
    }

    let downloadedImage: string | null = null;

    if (data instanceof Blob) {
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        downloadedImage = fr.result as string;
      };
    }

    return downloadedImage as unknown as string;
  }

  async uploadImage({ path, arraybuffer, mimeType }: UploadImageProps) {
    if (!path || !arraybuffer || !mimeType) {
      printError(`image-upload-error`, new Error(`Path, arraybuffer and mimeType are required`));
      throw new Error(ERROR_CODES.UPLOAD_FAILED);
    }

    const { data, error } = await supabase.storage.from("avatars").upload(path, arraybuffer, {
      contentType: mimeType ?? "image/jpeg",
    });

    if (error) {
      printError(`image-upload-error`, error);
      throw new Error(ERROR_CODES.UPLOAD_FAILED);
    }

    return data;
  }
}

export function useQueryImage(queryKey: string) {
  const service = new ImageService();
  const queryClient = useQueryClient();
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [downloadedImagePath, setDownloadedImagePath] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: service.uploadImage,
    mutationKey: ["image", queryKey],
    onSuccess: (data) => {
      setUploadedImagePath(data.path);
      queryClient.invalidateQueries({ queryKey: ["image", queryKey] });
    },
    onError: (err) => toast.error(translateError(err.message)),
  });

  const downloadMutation = useMutation({
    mutationFn: service.downloadImage,
    mutationKey: ["image", queryKey],
    onSuccess: (data) => {
      if (data) {
        setDownloadedImagePath(data);
        queryClient.invalidateQueries({ queryKey: ["image", queryKey] });
      }
    },
    onError: (err) => toast.error(translateError(err.message)),
  });

  const isUploading = uploadMutation.isPending;
  const isDownloading = downloadMutation.isPending;

  return {
    isUploading,
    uploadMutation,
    downloadMutation,
    uploadedImagePath,
    downloadedImagePath,
    isDownloading,
  };
}
