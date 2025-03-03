import express from "express";
import mongoose from "mongoose";
// import functionality from controller, MiddleWares should be added in the middle
import {
  addReview,
  getAllReviewsByBookId,
  updateReviewById,
  deleteReviewById,
} from "../controllers/review.controller.js";
const Router = express.Router();
Router.post("/", async (req, res, next) => {
  try {
    const review = await addReview(req.body);
    return res.status(200).json(review);
  } catch (err) {
    next(err);
  }
});
Router.get("/:id", async (req, res, next) => {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      const err = new Error("book id is not valid");
      err.status = 404;
      throw err;
    }
    const reviews = await getAllReviewsByBookId(bookId);
    return res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
});
Router.patch("/:id", async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      const err = new Error("review id is not valid");
      err.status = 401;
      throw err;
    }
    const updatedFields = req.body;
    const updatedReview = await updateReviewById(reviewId, updatedFields);
    res.status(200).json(updatedReview);
  } catch (err) {
    next(err);
  }
});
Router.delete("/:id", async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      const err = new Error("invalid review ID");
      err.status = 404;
      throw err;
    }
    await deleteReviewById(reviewId);
    res.status(200).json({ message: "removed sucessfully" });
  } catch (err) {
    next(err);
  }
});

export default Router;
