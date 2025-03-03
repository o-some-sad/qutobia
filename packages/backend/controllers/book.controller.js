import Book from '../models/book.model.js';

const addBook = async (formData) => {
  try {
    console.log(formData);
    const book = await Book.create(formData);
    return book;
  } catch (error) {
    throw new Error('Failed to add Book !');
  }
};

const listBooks = async() => {
  try{
    const book = await Book.find({}).exec();
    // .exec() returns a promise
    return book;
  }
  catch (err) {
    throw new Error('Failed to list books !')
  }
}

const filterBooks = async(rest,skip, limit) => {
  try{
    const book = await Book.find(rest).skip(skip).limit(limit).exec();
    return book;
  }
  catch (err) {
    throw new Error('Failed to list books !')
  }
}

const getBookByid = async(id) => {
  try{
    const bookByid = await Book.findById(id).exec();
    return bookByid;
  }
  catch (err) {
    throw new Error('Failed to list book !')
  }
}

const updateBookImage = async (id, filePath) => {
  try {
    return await Book.findByIdAndUpdate(id, { image: filePath }, {new: true});
  } catch (err) {
    throw err;
  }
};

export {addBook, updateBookImage, listBooks, filterBooks, getBookByid};
