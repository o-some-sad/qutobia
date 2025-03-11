import express from "express";
import mongoose from "mongoose";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import validateSchema from "../middlewares/zodValidator.middleware.js";
import { reviewValidator } from "shared";
import {
  addReview,
  getAllReviewsByBookId,
  updateReviewById,
  deleteReviewById,
} from "../controllers/review.controller.js";
import ApiError from "../utilities/ApiErrors.js";

const Router = express.Router();
Router.post(
  "/",
  authenticateToken,
  validateSchema(reviewValidator),
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const review = await addReview(userId, req.body);
      return res.status(201).json(review); //resource creation
    } catch (err) {
      next(err);
    }
  }
);
Router.get("/:id", async (req, res, next) => {
  //public, no auth needed
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new ApiError("invalid book ID", 400); //bad request
    }
    const reviews = await getAllReviewsByBookId(bookId);
    return res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
});
Router.patch(
  "/:id",
  authenticateToken,
  validateSchema(reviewValidator),
  async (req, res, next) => {
    try {
      const reviewId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ApiError("invalid review ID", 404);
      }
      const updatedFields = req.body;
      const updatedReview = await updateReviewById(reviewId, updatedFields);
      res.status(200).json(updatedReview);
    } catch (err) {
      next(err);
    }
  }
);
Router.delete("/:id", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError("invalid review ID", 404);
    }
    await deleteReviewById(reviewId);
    res.status(200).json({ message: "removed sucessfully" });
  } catch (err) {
    next(err);
  }
});

export default Router;
