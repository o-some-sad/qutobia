import Book from "../models/book.model.js";

const addBook = async(body, image) => {
    // try{
        // console.log(body, image);
        const book = await Book.create(body);
        return book;
}

export {addBook};