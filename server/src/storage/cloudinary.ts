import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface FileProps {
  buffer: Buffer;
  key: string;
  mimetype: string;
  folder?: string;
}

export const uploadFile = async ({
  buffer,
  key,
  mimetype,
  folder = 'camera-rental-house',
}: FileProps): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: key.split('.')[0], // Remove extension from public_id
        folder: folder,
        resource_type: 'auto',
      },
      (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      }
    );

    uploadStream.end(buffer);
  });
};

export const deleteFile = async ({
  key,
}: {
  key: string;
}): Promise<void> => {
  // key is expected to be the full public_id (including folder, excluding extension)
  const publicId = key.split('.')[0];
  await cloudinary.uploader.destroy(publicId);
};

export const getSignedUrl = async ({
  key,
  folder = 'camera-rental-house',
}: {
  key: string;
  folder?: string;
}): Promise<string> => {
  // Cloudinary allows access via the secure_url returned during upload.
  // For signed URLs (private downloads), this would be different, 
  // but for basic usage we'll return the public URL.
  const publicId = `${folder}/${key.split('.')[0]}`;
  return cloudinary.url(publicId, { secure: true });
};

export default cloudinary;
