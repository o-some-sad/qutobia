import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
});

const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'kotobia/users',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    overwrite: true
  }
});

const bookStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'kotobia/books',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    overwrite: true
  }
});

export const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: 1024 * 1024 }, // 1 MB
});
export const uploadBookImage = multer({
  storage: bookStorage,
  limits: { fileSize: 1024 * 1024 }, // 1 MB
});
export { cloudinary };
