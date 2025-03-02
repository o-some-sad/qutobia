import express from 'express';
import {addBook, updateBookImage} from '../controllers/book.controller.js';
import {handleImageUpload} from "../middlewares/uploadImage.middleware.js";

const router = express.Router();

router.post('/', handleImageUpload('book'), async (req, res) => {
  const formData = req.body;
  const bookData = {...formData, image: req.file.path};
  try {
    const newBook = await addBook(bookData);
    res.status(201).json({status: 'success', data: newBook});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
});

router.patch('/:id/image', handleImageUpload('book'), async (req, res, next) => {
  const id = req.params.id;
  try {
    const book = await updateBookImage(id, req.file.path);
    res.status(200).json({ status: 'success', data: book });
  } catch (err) {
    next(err);
  }
});

export default router;

// router.get(); // get ALL or get by filters
// router.get(); // get by ID
// router.patch(); // modify a book's details
// router.delete(); // delete a book
