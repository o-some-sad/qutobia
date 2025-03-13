//@ts-check
import { Router } from "websocket-express";
import bookRouter from "./book.route.js";
import userRouter from "./user.route.js";
import reviewRouter from "./review.route.js";
import orderRouter from "./order.route.js";
import cartRouter from "./cart.route.js";
import adminRouter from "./admin.route.js";
import authRouter from "./auth.route.js";
import wsRouter from "./ws.route.js";
import { paymentRouter } from "./payment.route.js";

const router = new Router();
router.use("/", adminRouter);
router.use("/orders", orderRouter);
router.use("/books", bookRouter);
router.use("/users", userRouter);
router.use("/reviews", reviewRouter);
router.use("/cart", cartRouter);
router.use("/auth", authRouter);
router.use("/payment", paymentRouter);
router.use("/ws", wsRouter);
router.all("*", (req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

export default router;
