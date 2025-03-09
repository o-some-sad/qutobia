import Book from "../models/book.model.js";
import ApiError from "../utilities/ApiErrors.js";
import redisClient from "../utilities/redisClient.js";

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
    console.log("ERROR: ", error);
    throw new Error("Failed to add Book !");
  }
};

const listBooks = async () => {
  const cachedBooks = await redisClient.get("allBooks");
  if (cachedBooks) {
    console.log("Fetching books from Redis cache");
    return JSON.parse(cachedBooks);
  }
  console.log("Fetching from DB");
  const books = await Book.find({ deletedAt: null }).exec();
  const bookCount = await Book.find({ deletedAt: null })
    .countDocuments()
    .exec();    
  // exec() --> the query will run even if await is NOT there (returns a promise)
  // totalPages = totalBooks(bookCount) / booksPerPage(10)
  // totalPages = Math.ceil(bookCount / 10)
  const totalPages = Math.ceil(bookCount / 10);
  // if (books.length === 0) {
  //   throw new ApiError("No books found to list!", 400);
  // }
  const result = { Total_Pages: totalPages, Books: books };
  console.log("adding allBooks cache");
  await redisClient.set("allBooks", JSON.stringify(result));
  return result;
};

const filterBooks = async (rest, skip, limit) => {
  const cacheKey = `filtered_books:${JSON.stringify(rest)}:${skip}:${limit}`;
  const filter = { ...rest, deletedAt: null }; // to ensure that we get ONLY the books w/ deletedAt: null
  // as if I'm adding deletedAt: null in the params
  const cachedFilter = await redisClient.get(cacheKey);
  if (cachedFilter) {
    console.log("fetching filtered books from Redis cache");
    return JSON.parse(cachedFilter);
  }
  console.log("fetching from DB");
  const books = await Book.find(filter).skip(skip).limit(limit).exec();
  const filteredBookCount = await Book.find(filter)
    .skip(skip)
    .limit(limit)
    .countDocuments()
    .exec();
  const filterTotalPages = Math.ceil(filteredBookCount / 10);
  // if (books.length === 0) {
  //   throw new ApiError("No books found to list!", 400);
  // }
  const result = { Total_Pages: filterTotalPages, Books: books };
  await redisClient.set(cacheKey, JSON.stringify(result));
  return result;
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
    await redisClient.set(`book:${id}`, JSON.stringify(bookUpdated));
    const allBooks = await redisClient.get("allBooks");
    if (allBooks) {
      let allBooksParsed = JSON.parse(allBooks);
      allBooksParsed.Books = allBooksParsed.Books.map((book) => {
        if (book._id === id) {
          return bookUpdated;
        }
        return book;
      });
      console.log("updating allBooks cache");
      await redisClient.set("allBooks", JSON.stringify(allBooksParsed));
      return updatedBook;
    }
  } catch (err) {
    throw err;
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

export {
  addBook,
  updateBookImage,
  listBooks,
  filterBooks,
  getBookByid,
  deleteBook,
  updateBookDetails,
};
