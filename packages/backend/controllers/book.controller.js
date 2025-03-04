import Book from '../models/book.model.js';

const addBook = async (formData) => {
  try {
    const book = await Book.create(formData);
    return book;
  } catch (error) {
    console.log("ERROR: ",error);
    throw new Error('Failed to add Book !');
  }
};

const listBooks = async() => {
    const books = await Book.find({deletedAt: null}).exec();
    const bookCount = await Book.find({deletedAt: null}).countDocuments().exec();
      // exec() --> the query will run even if await is NOT there (returns a promise)
    if(books.length === 0){
      const err = new Error("No books found to list !");
      err.status = 400;
      throw err;
    }
    return {Total_Books: bookCount, Books: books};
}

const filterBooks = async(rest,skip, limit,) => {
    const filter = { ...rest, deletedAt: null }; // to ensure that we get ONLY the books w/ deletedAt: null
    // as if I'm adding deletedAt: null in the params
    const book = await Book.find(filter).skip(skip).limit(limit).exec();
    if(book.length === 0){
      const err = new Error("No books found to list !");
      err.status = 400;
      throw err;
    }
    return book;
}

const getBookByid = async(id) => {
    // 67c70a37e5660061b49db3f7 - tfios --> deletedAt = null
    const bookByid = await Book.findOne({ _id: id, deletedAt:null}).exec();
    if(bookByid === null){
      const err = new Error("No books found to list !");
      err.status = 400;
      throw err;
    }
    return bookByid;
}

const updateBookImage = async (id, filePath) => {
  try {
    return await Book.findByIdAndUpdate(id, { image: filePath }, {new: true});
  } catch (err) {
    throw err;
  }
};

const deleteBook = async(id) => { // shadow delete
    const bookDeleted = await Book.findByIdAndUpdate(id,{deletedAt: Date.now()}).exec();
    // check if the book is already deleted THEN --> No books found
    if(bookDeleted === null || bookDeleted.deletedAt != null){
      const err = new Error("No books found to delete !");
      err.status = 400;
      throw err;
    }
    return "Book deleted successfully !";
}

const updateBookDetails = async(id, rest) => {
  const bookUpdated = await Book.findByIdAndUpdate(id,{$set:rest},{new: true, runValidators: true,}).exec();
  if(bookUpdated === null || bookUpdated.deletedAt != null){
    const err = new Error("No books found to update !");
    err.status = 400;
    throw err;
  }
  return { message: "Book updated successfully!", bookUpdated };
}
export {addBook, updateBookImage, listBooks, filterBooks, getBookByid, deleteBook, updateBookDetails};
