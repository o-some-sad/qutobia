import express from "express";
// import functionality from controller, MiddleWares should be added in the middle
import {
  addReview,
  getAllReviewsByBookId,
  updateReviewById,
  deleteReviewById,
} from "../controllers/review.controller.js";
const Router = express.Router();
Router.post("/", addReview);
Router.get("/:id", getAllReviewsByBookId);
Router.patch("/:id", updateReviewById);
Router.delete("/:id", deleteReviewById);

export default Router;
