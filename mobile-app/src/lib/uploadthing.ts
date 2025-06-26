import { generateReactNativeHelpers } from "@uploadthing/expo";
import type { UploadThingRouter } from "@/typings/uploadthing";

export const { useImageUploader, uploadFiles } = generateReactNativeHelpers<UploadThingRouter>({
	/**
	 * Your server url.
	 * @default process.env.EXPO_PUBLIC_API_BASE_URL
	 * @remarks In dev we will also try to use Expo.debuggerHost
	 */
	url: process.env.EXPO_PUBLIC_API_BASE_URL,
});
