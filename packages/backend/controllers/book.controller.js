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

export {addBook};
