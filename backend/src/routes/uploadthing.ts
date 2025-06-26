import { createUploadthing, type FileRouter } from "uploadthing/fastify";
import { getAuth } from "@clerk/fastify";

const f = createUploadthing();

export const uploadRouter = {
	// Avatar image upload endpoint
	avatarUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			// Use Clerk to get auth from the request
			const { userId } = getAuth(req);
			
			if (!userId) {
				throw new Error("Unauthorized");
			}

			return { userId };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.userId);
			console.log("File URL:", file.url);

			// You can update your database here with the file URL
			// await updateUserAvatar(metadata.userId, file.url);

			return { uploadedBy: metadata.userId };
		}),

	// General image upload endpoint (for claxon images, etc.)
	imageUploader: f({
		image: {
			maxFileSize: "8MB",
			maxFileCount: 4,
		},
	})
		.middleware(async ({ req }) => {
			const { userId } = getAuth(req);
			
			if (!userId) {
				throw new Error("Unauthorized");
			}

			return { userId };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Image upload complete for userId:", metadata.userId);
			console.log("File URL:", file.url);

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;