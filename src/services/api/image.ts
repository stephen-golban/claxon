import type { AuthError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { ERROR_CODES } from "@/lib/constants";
import { getSupabaseErrorCode, printError, translateError } from "@/lib/utils";
import { supabase } from "./client";

export type UploadImageProps = Partial<{
  path: string;
  arraybuffer: ArrayBuffer;
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

    if (data instanceof Blob) {
      return new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => {
          const result = fr.result as string;
          resolve(result);
        };
        fr.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        fr.readAsDataURL(data);
      });
    }

    throw new Error("Downloaded data is not a Blob");
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
      throw getSupabaseErrorCode(error as unknown as AuthError);
    }

    return data;
  }

  async deleteImage(path: string) {
    const { error } = await supabase.storage.from("avatars").remove([path]);

    if (error) {
      printError(`image-delete-error`, error);
      throw getSupabaseErrorCode(error as unknown as AuthError);
    }
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

// New optimized hook that uses React Query for proper caching
export function useDownloadImage(
  avatarUrl: string | null | undefined,
  queryKey: string,
  size: number | [number, number],
) {
  const service = new ImageService();

  return useQuery({
    queryKey: ["image", "download", queryKey, avatarUrl, size],
    queryFn: () => {
      if (!avatarUrl) {
        throw new Error("Avatar URL is required");
      }
      return service.downloadImage(avatarUrl, size);
    },
    enabled: !!avatarUrl, // Only run query when avatarUrl exists
    staleTime: 15 * 60 * 1000, // Consider data fresh for 15 minutes (longer for images)
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch on focus to prevent flickering
    refetchOnReconnect: false, // Don't refetch on reconnect to prevent flickering
    refetchOnMount: false, // Don't refetch on mount if data exists
  });
}

export function useDeleteImage(queryKey: string) {
  const service = new ImageService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.deleteImage,
    mutationKey: ["image", "delete", queryKey],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image", queryKey] });
    },
    onError: (err) => toast.error(translateError(err.message)),
  });
}
