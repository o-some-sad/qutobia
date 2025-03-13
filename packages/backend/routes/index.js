//@ts-check
import express from "express";
import bookRouter from "./book.route.js";
import userRouter from "./user.route.js";
import reviewRouter from "./review.route.js";
import orderRouter from "./order.route.js";
import cartRouter from "./cart.route.js";
import adminRouter from "./admin.route.js";
import authRouter from "./auth.route.js";
import { paymentRouter } from "./payment.route.js";

const Router = express.Router();
Router.use("/", adminRouter);
Router.use("/orders", orderRouter);
Router.use("/books", bookRouter);
Router.use("/users", userRouter);
Router.use("/reviews", reviewRouter);
Router.use("/cart", cartRouter);
Router.use("/auth",authRouter);
Router.use("/payment", paymentRouter);
Router.all("*", (req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

export default Router;
