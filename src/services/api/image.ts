import type { AuthError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
import type { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { ERROR_CODES } from "@/lib/constants";
import { getSupabaseErrorCode, printError, translateError } from "@/lib/utils";
import { supabase } from "./client";

export type UploadImageProps = Partial<{
  base64: string;
  fileName: string;
  mimeType: ImagePickerAsset["mimeType"];
}>;

export class ImageService {
  async downloadImage(path: string, size: number | [number, number]) {
    const width = Array.isArray(size) ? size[0] : size;
    const height = Array.isArray(size) ? size[1] : size;
    const { data, error } = await supabase.storage.from("avatars").download(path, { transform: { width, height } });

    if (error) {
      printError(`image-download-error`, error);
      throw getSupabaseErrorCode(error as unknown as AuthError);
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

  async uploadImage({ base64, fileName, mimeType }: UploadImageProps) {
    if (!base64 || !fileName || !mimeType) {
      printError(`image-upload-error`, new Error(`Path, arraybuffer, fileName and mimeType are required`));
      throw new Error(ERROR_CODES.UPLOAD_FAILED);
    }

    const { data, error } = await supabase.storage.from("avatars").upload(fileName, decode(base64), {
      contentType: mimeType ?? "image/png",
    });

    if (error) {
      printError(`image-upload-error`, error);
      throw getSupabaseErrorCode(error as unknown as AuthError);
    }

    return data;
  }
}

export function useUploadImage(queryKey: string) {
  const service = new ImageService();
  const queryClient = useQueryClient();
  const [path, setPath] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: service.uploadImage,
    mutationKey: ["image", queryKey],
    onSuccess: (data) => {
      setPath(data.path);
      queryClient.invalidateQueries({ queryKey: ["image", queryKey] });
    },
    onError: (err) => toast.error(translateError(err.message)),
  });

  return [path, mutation] as [string, typeof mutation];
}
export function useDownloadImage(queryKey: string, size: number | [number, number]) {
  const service = new ImageService();
  const queryClient = useQueryClient();
  const [path, setPath] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (vars: string) => service.downloadImage(vars, size),
    mutationKey: ["image", queryKey, size],
    onSuccess: (data) => {
      if (data) {
        setPath(data);
        queryClient.invalidateQueries({ queryKey: ["image", queryKey, size] });
      }
    },
    onError: (err) => toast.error(translateError(err.message)),
  });

  return [path, mutation] as [string, typeof mutation];
}
