import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import { v2 as cloudinary } from 'cloudinary';
import {uploadBookImage, uploadUserImage} from "../utilities/cloudinaryConfig.js";

export const handleImageUpload = (model)=> async (req, res, next) => {
  const id = req.params.id;
  switch (model) {
    case 'user':
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
      await handleImage(uploadUserImage, user.image)(req, res, next);
      break;

    case 'book':
      if (!id) {
        await handleImage(uploadBookImage, null)(req, res, next);
      } else {
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ status: 'fail', message: 'Book not found' });
        await handleImage(uploadBookImage, book.image)(req, res, next);
      }
      break;

    default:
      return res.status(400).json({ status: 'fail', message: 'Invalid model' });
  }
};

function handleImage(uploadFunction, imageUrl) {
  return async function (req, res, next) {
    uploadFunction.single('image')(req, res, async function (err) {
      if (err || !req.file) return res.status(400).json({ status: 'fail', message: 'NoImageUploaded, FileTooLarge or FileTypeNotSupported.' });
      await deleteImageFromCloudinary(imageUrl);
      next();
    });
  };
}

async function deleteImageFromCloudinary(imageUrl) {
  try {
    if (!imageUrl) return;
    const publicId = imageUrl.split('/').slice(-3).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId, {invalidate: true});
  } catch (err) {
    throw err;
  }
}
