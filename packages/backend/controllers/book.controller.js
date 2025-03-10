import Book from "../models/book.model.js";
import ApiError from "../utilities/ApiErrors.js";
import redisClient from "../utilities/redisClient.js";
import User from "../models/user.model.js";

const addBook = async (formData) => {
  try {
    const book = await Book.create(formData);
    const allBooks = await redisClient.get("allBooks");
    if (allBooks) {
      var allBooksParsed = JSON.parse(allBooks);
      allBooksParsed.Books.push(book);
      console.log("appending to allBooks cache");
      await redisClient.set("allBooks", JSON.stringify(allBooksParsed));
    }
    // else {
    //   console.log("creating cache for allBooks");
    //   await redisClient.set("allBooks", JSON.stringify(allBooksParsed));
    // }
    console.log("caching the book individually");
    await redisClient.set(`book:${book._id}`, JSON.stringify(book));
    // console.log(typeof allBooks);
    // await redisClient.del("allBooks"); //delete the cache, to be added in the next get request
    return book;
  } catch (error) {
    throw new ApiError("Failed to add Book !");
  }
};

const filterBooks = async (filters, page, limit) => {
  // const cacheKey = `filtered_books:${JSON.stringify(rest)}:${skip}:${limit}`;
  // const filter = { ...rest, deletedAt: null }; // to ensure that we get ONLY the books w/ deletedAt: null
  // // as if I'm adding deletedAt: null in the params
  // const cachedFilter = await redisClient.get(cacheKey);
  // if (cachedFilter) {
  //   console.log("fetching filtered books from Redis cache");
  //   return JSON.parse(cachedFilter);
  // }
  // console.log("fetching from DB");
  // const books = await Book.find(filter).skip(skip).limit(limit).exec();
  // const filteredBookCount = await Book.find(filter)
  //   .skip(skip)
  //   .limit(limit)
  //   .countDocuments()
  //   .exec();
  // const filterTotalPages = Math.ceil(filteredBookCount / 10);
  // const result = { Total_Pages: filterTotalPages, Books: books };
  // await redisClient.set(cacheKey, JSON.stringify(result));
  // return result;




  try {
    const count = await Book.countDocuments(filters);
    const books = await Book.find(filters).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).exec();
    // sort --> for the newest book to be at the beginning
    // skip logic to be handled in the client-side
    return { totalPages: Math.ceil(count / limit), data: books };
  } catch (err) {
    throw new ApiError("No books found to list!", 400);
  }
};

const getBookByid = async (id) => {
  // 67c70a37e5660061b49db3f7 - tfios --> deletedAt = null
  const cachedBook = await redisClient.get(`book:${id}`);
  if (cachedBook) {
    console.log("fetching book from redis");
    return JSON.parse(cachedBook);
  }
  console.log("fetching book from DB");
  const bookByid = await Book.findOne({ _id: id, deletedAt: null }).exec();
  if (bookByid === null) {
    throw new ApiError("No books found to list!", 400);
  }
  console.log("caching the book individually");
  await redisClient.set(`book:${id}`, JSON.stringify(bookByid));
  return bookByid;
};

const updateBookImage = async (id, filePath) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { image: filePath },
      { new: true }
    );
    console.log("updating the individual book cache");
    await redisClient.set(`book:${id}`, JSON.stringify(updatedBook));
    const allBooks = await redisClient.get("allBooks");
    if (allBooks) {
      let allBooksParsed = JSON.parse(allBooks);
      allBooksParsed.Books = allBooksParsed.Books.map((book) => {
        if (book._id === id) {
          return updatedBook;
        }
        return book;
      });
      console.log("updating allBooks cache");
      await redisClient.set("allBooks", JSON.stringify(allBooksParsed));
      return updatedBook;
    }
  } catch (err) {
    throw new ApiError("Failed to update book image !", 400);
  }
};

const deleteBook = async (id) => {
  // shadow delete
  const bookDeleted = await Book.findByIdAndUpdate(id, {
    deletedAt: Date.now(),
  }).exec();
  // check if the book is already deleted THEN --> No books found
  if (bookDeleted === null || bookDeleted.deletedAt != null) {
    throw new ApiError("No books found to delete!", 400);
  }
  const allBooks = await redisClient.get("allBooks");
  if (allBooks) {
    let allBooksParsed = JSON.parse(allBooks);
    allBooksParsed.Books = allBooksParsed.Books.filter(
      (book) => book._id !== id
    );
    console.log("deleting from allBooks cache");
    await redisClient.set("allBooks", JSON.stringify(allBooksParsed));
  }
  console.log("deleting individual book cache");
  await redisClient.del(`book:${id}`);
  return "Book deleted successfully !";
};

const updateBookDetails = async (id, rest) => {
  const bookUpdated = await Book.findByIdAndUpdate(
    id,
    { $set: rest },
    { new: true, runValidators: true }
  ).exec();
  if (bookUpdated === null || bookUpdated.deletedAt != null) {
    throw new ApiError("No books found to update!", 400);
  }
  const allBooks = await redisClient.get("allBooks");
  if (allBooks) {
    let allBooksParsed = JSON.parse(allBooks);
    allBooksParsed.Books = allBooksParsed.Books.map((book) => {
      if (book._id === id) {
        return bookUpdated;
      } else {
        return book;
      }
    });
    console.log("update allBooks cache");
    await redisClient.set("allBooks", JSON.stringify(allBooksParsed));
  }
  console.log("updating the individual book cache");
  await redisClient.set(`book:${id}`, JSON.stringify(bookUpdated));
  return { message: "Book updated successfully!", bookUpdated };
};

/********************************************************************************/
const getAllBooks = async (filters, page, limit) => {
  try {
    const count = await User.countDocuments(filters);
    const books = await Book.find(filters).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).exec();
    console.log(count)
    return { totalPages: Math.ceil(count / limit), data: books};
  } catch (err) {
    throw err;
  }
};

export {
  addBook,
  updateBookImage,
  filterBooks,
  getBookByid,
  deleteBook,
  updateBookDetails,
  getAllBooks
};
