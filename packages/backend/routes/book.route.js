import express from 'express';
import {addBook, updateBookImage, listBooks, filterBooks, getBookByid, deleteBook, updateBookDetails} from '../controllers/book.controller.js';
import {handleImageUpload} from "../middlewares/uploadImage.middleware.js";
import mongoose from 'mongoose';
import multer from 'multer'
import Book from '../models/book.model.js';
// AUTHENTICATION IS STILL NEEDED

const router = express.Router();
const upload = multer();

router.post('/', handleImageUpload('book'), async (req, res) => {
  const formData = req.body;
  const bookData = {...formData, image: req.file.path};
  try {
    const newBook = await addBook(bookData);
    res.status(201).json({data: newBook});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
});

router.get('/', async(req, res, next) => { // get ALL or get by filters
  try{
    if(Object.keys(req.query).length === 0){
        const booksStored = await listBooks();
        res.status(201).json(booksStored);
      }else{ // query params (skip - limit - filters)
      const {skip, limit, ...rest} = req.query;
      const filteredBooks = await filterBooks(rest, skip, limit);
      res.status(200).json(filteredBooks);
    } 
  }
  catch(err){
    next(err);
  }
});

router.get('/:id', async(req, res, next) => {
  const id = req.params.id;
  try{
    const specificBook = await getBookByid(id);
    res.status(201).json({data: specificBook});
  }
  catch(err){
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({status: 'fail', message: "Invalid ID format. Must be a 24-character hex string."});
    }
    next(err);
  }
}); // get by ID

router.patch('/:id/image', handleImageUpload('book'), async (req, res, next) => {
  const id = req.params.id;
  try {
    const book = await updateBookImage(id, req.file.path);
    res.status(200).json({data: book });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async(req, res, next) => {
  const id = req.params.id;
  try{
    const removeBook = await deleteBook(id);
    res.status(200).json({data: removeBook });
}
  catch(err){
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({status: 'fail', message: "Invalid ID format. Must be a 24-character hex string."});
    }
    next(err);
  }
}); // delete a book


// update a book's details
router.patch('/:id', upload.none(), async(req, res, next) => {
  // upload.none() --> for handling text-fields ONLY (won't update img)
  const id = req.params.id;
  const body = req.body;
  // deletedAt shouldn't be updated here - avoid updating it SO destructure it
  const {deletedAt, ...rest} = body;
  try{
  const updatedBook = await updateBookDetails(id, rest);
  res.status(200).json(updatedBook);
}
  catch(err){
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({status: 'fail', message: "Invalid ID format. Must be a 24-character hex string."});
    }
    next(err);
}
});



export default router;
