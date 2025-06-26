import { generateReactNativeHelpers } from "@uploadthing/expo";
import type { UploadThingRouter } from "@/typings/uploadthing";

export const { useImageUploader, uploadFiles } =
	generateReactNativeHelpers<UploadThingRouter>({
		/**
		 * Your server url.
		 * @remarks Points to the Expo API route for UploadThing
		 */
		url: process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8081",
	});
