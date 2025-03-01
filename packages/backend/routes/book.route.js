import express from 'express';
import {addBook} from '../controllers/book.controller.js';
import {uploadBookImage} from "../utilities/cloudinaryConfig.js";

const router = express.Router();

router.post('/', uploadBookImage.single('image'), async (req, res) => {
  const formData = req.body;
  if (!req.file || !req.file.path) {
    return res.status(400).json({msg: 'Please upload an image!'});
  }

  const bookData = {...formData, image: req.file.path};
  try {
    const newBook = await addBook(bookData);
    res.status(201).json({status: 'success', data: newBook});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
});

export default router;

// router.get(); // get ALL or get by filters
// router.get(); // get by ID
// router.patch(); // modify a book's details
// router.delete(); // delete a book
