import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a Base64 data URI or Buffer to Cloudinary
 */
export async function uploadToCloudinary(
  fileBase64: string,
  folder: string = "wedding-saas/invitations"
): Promise<UploadResult> {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn("Cloudinary credentials not found. Using placeholder fallback.");
    // Return mock response for local testing if keys are not set
    return {
      secure_url: fileBase64.startsWith("data:") ? fileBase64 : "/templates/kitab-e-nikah/palace-hall.jpg",
      public_id: `mock_${Date.now()}`,
      width: 1200,
      height: 800,
      format: "jpg",
      bytes: 102400,
    };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileBase64,
      {
        folder,
        resource_type: "auto",
        transformation: [
          { quality: "auto:good", fetch_format: "auto" },
          { width: 1920, crop: "limit" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      }
    );
  });
}

export interface AudioUploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  duration?: number;
  bytes: number;
}

/**
 * Upload an audio file to Cloudinary
 */
export async function uploadAudioToCloudinary(
  filePath: string,
  folder: string = "wedding-saas/audio",
  publicId?: string
): Promise<AudioUploadResult> {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials not found. Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        public_id: publicId,
        resource_type: "video", // Cloudinary stores and streams audio under the "video" resource type
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary audio upload failed"));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            duration: result.duration,
            bytes: result.bytes,
          });
        }
      }
    );
  });
}

/**
 * Delete a media file from Cloudinary by public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return true;
  }
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (err) {
    console.error("Cloudinary deletion failed:", err);
    return false;
  }
}

export default cloudinary;

