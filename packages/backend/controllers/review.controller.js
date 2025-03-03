//@ts-check
import mongoose from "mongoose";
import Review from "../models/review.model.js";
import express from "express";
export const addReview = async (req, res, next) => {
  try {
    const reviewData = { ...req.body };
    const review = await Review.create(reviewData);
    return res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

export const getAllReviewsByBookId = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("not a valid book ID");
    }
    const reviews = await Review.find({ book: bookId })
      .populate("user", "name")
      .populate("book", "title")
      .exec();
    if (reviews.length === 0) {
      throw new Error("review not found");
    }
    return res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const updateReviewById = async (req, res, next) => {
  //authorization still nedded
  //any extra fields will be accepted but not added to the database.
  try {
    const reviewId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("review Id is invalid");
    }
    const updatedFields = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { ...updatedFields },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedReview) {
      throw new Error("review doesn't exist");
    }
    res.status(200).json(updatedReview);
  } catch (err) {
    next(err);
  }
};

export const deleteReviewById = async (req, res, next) => {
  //authorization needed
  try {
    const reviewId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("invalid review id");
    }
    const deleted = await Review.deleteOne({ _id: reviewId });
    if (deleted.deletedCount === 0) {
      throw new Error("review not found");
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    next(err);
  }
};
