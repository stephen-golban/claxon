import { type FileRouter, createRouteHandler, createUploadthing } from "uploadthing/server";
import { requireAuth } from "../../src/lib/auth-middleware";

const f = createUploadthing();

// Define file router for avatar uploads
const uploadRouter = {
  // Avatar upload route
  avatarUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }: { req: Request }) => {
      // Verify user is authenticated
      const auth = await requireAuth(req);
      if (!auth) {
        throw new Error("Unauthorized");
      }

      // Return metadata that will be accessible in onUploadComplete
      return { userId: auth.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Here you could update the user's avatar URL in the database
      // await updateUserAvatar(metadata.userId, file.url);

      return { url: file.url };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

// Create the route handler using UploadThing's createRouteHandler
const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

// Export handlers for GET and POST requests
export { GET, POST };
