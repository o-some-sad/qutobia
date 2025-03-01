import express from "express";
// import functionality from controller, MiddleWares should be added in the middle
import { addReview } from "../controllers/review.controller.js";
const Router = express.Router();
Router.post("/", addReview);
// Router.get("/:id", getAllReviewsByBookId);
// Router.patch("/:id", updateReview);
// Router.delete("/:id", deleteReview);

export default Router;
