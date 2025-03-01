import express from "express";
import reviewRouter from "./review.route.js";
const Router = express.Router();
Router.use("/api/reviews", reviewRouter);
export default Router;
