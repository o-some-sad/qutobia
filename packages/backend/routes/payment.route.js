//@ts-check
/// <reference path="../express.d.ts" />
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import ApiError from "../utilities/apiError.js";
import * as PaymentController from "../controllers/payment.controller.js";

export const paymentRouter = express.Router();

//TODO: add auth token after finishing login frontend logic
paymentRouter.post("/create", authenticateToken, async (req, res, next) => {
  try {
    const url = await PaymentController.createPaymentFromUserId(req.user._id);

    res.json({
      url: url,
    });
  } catch (error) {
    console.log(error);

    return next(error);
  }
});

paymentRouter.get("/success", authenticateToken, async (req, res, next) => {
  try {
    const { payment } = req.query;
    //TODO: THIS SHOULD NEVER HAPPEN
    if (!payment || typeof payment !== "string"){
      throw new ApiError("Cannot retrive payment reference", 400);
    }
    await PaymentController.transformPayment(payment, req.user._id);
    return res.redirect("/");
  } catch (err) {
    console.log("WA?T", err);
    
    return next(err);
  }
});

paymentRouter.get("/cancel", (req, res) => {
  console.log("CANCEL", req.query);

  res.redirect("/order");
});
