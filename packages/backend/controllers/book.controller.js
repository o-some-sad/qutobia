import Book from "../models/book.model.js";
import ApiError from "../utilities/ApiErrors.js";
import redisClient from "../utilities/redisClient.js";

const addBook = async (formData) => {
  const book = await Book.create(formData);
  const allBooks = await redisClient.get("allBooks");
  if (allBooks) {
    var allBooksParsed = JSON.parse(allBooks);
    allBooksParsed.Books.push(book);
    console.log("appending to allBooks cache");
    await redisClient.set(
      "allBooks",
      JSON.stringify(allBooksParsed),
      "EX",
      3600
    );
  } else {
    console.log("creating cache for allBooks");
    await redisClient.set("allBooks", JSON.stringify(allBooksParsed));
  }
  console.log("caching the book individually");
  await redisClient.set(`book:${book._id}`, JSON.stringify(book), "EX", 3600);
  // console.log(typeof allBooks);
  // await redisClient.del("allBooks"); //delete the cache, to be added in the next get request
  return book;
};

const filterBooks = async (filters, page, limit) => {
  try {
    console.log("FILTERS:", filters);
    const key = `filteredBooks:${JSON.stringify(
      filters
    )}:page${page}:limit${limit}`;
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log("Fetching filtered books from Redis cache");
      return JSON.parse(cachedData);
    }

    const count = await Book.countDocuments(filters);
    const books = await Book.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const response = { totalPages: Math.ceil(count / limit), data: books };
    await redisClient.set(key, JSON.stringify(response), "EX", 3600);
    // sort --> for the newest book to be at the beginning
    // skip logic to be handled in the client-side
    return response;
  } catch {
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
  await redisClient.set(`book:${id}`, JSON.stringify(bookByid), "EX", 3600);
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
    await redisClient.set(
      `book:${id}`,
      JSON.stringify(updatedBook),
      "EX",
      3600
    );
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
      await redisClient.set(
        "allBooks",
        JSON.stringify(allBooksParsed),
        "EX",
        3600
      );
      return updatedBook;
    }
  } catch {
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
    await redisClient.set(
      "allBooks",
      JSON.stringify(allBooksParsed),
      "EX",
      3600
    );
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
    await redisClient.set(
      "allBooks",
      JSON.stringify(allBooksParsed),
      "EX",
      3600
    );
  }
  console.log("updating the individual book cache");
  await redisClient.set(`book:${id}`, JSON.stringify(bookUpdated), "EX", 3600);
  return { message: "Book updated successfully!", bookUpdated };
};

const bookFilters = async () => {
  return Book.aggregate([
    {
      $match: { deletedAt: null },
    },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        author: { $addToSet: "$author" },
      },
    },
  ]);
};

export {
  addBook,
  updateBookImage,
  filterBooks,
  getBookByid,
  deleteBook,
  updateBookDetails,
  bookFilters,
};
