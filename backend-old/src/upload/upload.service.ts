import type { User } from "@clerk/backend";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class UploadService {
  private uploadthingSecret: string;

  constructor() {
    this.uploadthingSecret = process.env.UPLOADTHING_SECRET || "";

    if (!this.uploadthingSecret) {
      throw new Error("UPLOADTHING_SECRET is not configured");
    }
  }

  async uploadAvatar(
    file: Express.Multer.File,
    user: User,
  ): Promise<{ url: string }> {
    try {
      // Validate file type
      if (!file.mimetype.startsWith("image/")) {
        throw new BadRequestException("Only image files are allowed");
      }

      // Validate file size (4MB max)
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSize) {
        throw new BadRequestException("File size must be less than 4MB");
      }

      // For now, return a mock URL since UploadThing has module compatibility issues
      // In production, you would implement the actual UploadThing upload here
      const mockUrl = `https://uploadthing.com/f/${Date.now()}-${file.originalname}`;

      console.log("Avatar upload simulated for userId:", user.id);
      console.log("File details:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      // Here you could update the user's avatar URL in the database
      // await updateUserAvatar(user.userId, mockUrl);

      return { url: mockUrl };
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("File upload failed");
    }
  }

  validateImageFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image files are allowed");
    }

    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      throw new BadRequestException("File size must be less than 4MB");
    }
  }
}
