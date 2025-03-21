import express from "express";
import {
  addBook,
  updateBookImage,
  filterBooks,
  getBookByid,
  deleteBook,
  updateBookDetails,
  bookFilters
} from "../controllers/book.controller.js";
import { handleImageUpload } from "../middlewares/uploadImage.middleware.js";
import mongoose from "mongoose";
import multer from "multer";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();
const upload = multer();

router.post(
  "/",
  authenticateToken,
  isAdmin,
  handleImageUpload("book"),
  async (req, res) => {
    const formData = req.body;
    const bookData = { ...formData, image: req.file.path };
    try {
      const newBook = await addBook(bookData);
      return res.status(201).json({ data: newBook });
    } catch (err) {
      return res.status(400).json({ status: "fail", message: err.message });
    }
  }
);

router.get("/", async (req, res, next) => {
  // get ALL or get by filters
  const filters = { deletedAt: null };
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  try {
    if(req.query.title) filters.title = { $regex: req.query.title, $options: 'i' }; // i for case insensitive
    if(req.query.author) filters.author = { $regex: req.query.author, $options: 'i' }; // i for case insensitive
    if(req.query.lowerPrice && req.query.upperPrice) {
      filters.price = { $gte: req.query.lowerPrice, $lte: req.query.upperPrice };
    } else if(req.query.lowerPrice) {
      filters.price = { $gte: req.query.lowerPrice };
    } else if(req.query.upperPrice) {
      filters.price = { $lte: req.query.upperPrice };
    }
    const books = await filterBooks(filters, page, limit);
    res.status(200).json({ totalPages: books.totalPages, data: books.data });
  } catch (err) {
    next(err);
  }
});

router.get('/filters', async (req, res, next) => {
  try {
    const result = await bookFilters();
    if (result.length > 0) {
      const author = result[0].author.reduce((a, b) => [...a, ...b], []);
      const setAuthor = new Set(author);
      return res.status(200).json({ author: Array.from(setAuthor), price: [result[0].minPrice, result[0].maxPrice ]});
    } else {
      return res.status(200).json({ author: [], price: [0, 0] });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const specificBook = await getBookByid(id);
    return res.status(201).json({ data: specificBook });
  } catch (err) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: "fail",
        message: "Invalid ID format. Must be a 24-character hex string.",
      });
    }
    console.log(err);
    next(err);
  }
}); // get by ID

router.patch(
  "/:id/image",
  authenticateToken,
  isAdmin,
  handleImageUpload("book"),
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const book = await updateBookImage(id, req.file.path);
      return res.status(200).json({ data: book });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", authenticateToken, isAdmin, async (req, res, next) => {
  const id = req.params.id;
  try {
    const removeBook = await deleteBook(id);
    return res.status(200).json({ data: removeBook });
  } catch (err) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: "fail",
        message: "Invalid ID format. Must be a 24-character hex string.",
      });
    }
    next(err);
  }
}); // delete a book

// update a book's details
router.patch(
  "/:id",
  upload.none(),
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    // upload.none() --> for handling text-fields ONLY (won't update img)
    const id = req.params.id;
    const body = req.body;
    // deletedAt shouldn't be updated here - avoid updating it SO destructure it
    const { deletedAt: _deletedAt, ...rest } = body;
    try {
      const updatedBook = await updateBookDetails(id, rest);
      return res.status(200).json(updatedBook);
    } catch (err) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid ID format. Must be a 24-character hex string.",
        });
      }
      next(err);
    }
  }
);

export default router;

// ROUTE FOR REGISTER //
