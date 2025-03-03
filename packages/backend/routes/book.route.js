import express from 'express';
import {addBook, updateBookImage, listBooks, filterBooks, getBookByid, deleteBook} from '../controllers/book.controller.js';
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

router.get('/', async(req, res) => { // get ALL or get by filters
  if(Object.keys(req.query).length === 0){
      const booksStored = await listBooks();
      res.json(booksStored);
  }else{ // query params (skip - limit - filters)
    const {skip, limit, ...rest} = req.query;
    const filteredBooks = await filterBooks(rest, skip, limit);
    res.status(200).json(filteredBooks);
  }  
});

router.get('/:id', async(req, res, next) => {
  let id = req.params.id;
  const specificBook = await getBookByid(id);
  res.status(200).json(specificBook)
}); // get by ID

router.patch('/:id/image', handleImageUpload('book'), async (req, res, next) => {
  const id = req.params.id;
  try {
    const book = await updateBookImage(id, req.file.path);
    res.status(200).json({ status: 'success', data: book });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async(req, res, next) => {
  let id = req.params.id;
  const removeBook = await deleteBook(id);
  res.status(200).json(removeBook);
}); // delete a book

export default router;

// router.get(); // get ALL or get by filters
// router.get(); // get by ID
// router.patch(); // modify a book's details
// router.delete(); // delete a book
