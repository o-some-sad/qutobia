//@ts-check
/// <reference path="../express.d.ts" />
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import ApiError from "../utilities/apiError.js";
import * as PaymentController from '../controllers/payment.controller.js'

export const paymentRouter = express.Router()



//TODO: add auth token after finishing login frontend logic
paymentRouter.post("/create", async (req, res, next) => {
  try {
    // if (req.user.role !== 'user') throw new ApiError("Unauthorized", 401);
    const userId = "67c38059cacfc69180d9c66d"

    const url = await PaymentController.createPaymentFromUserId(userId)
    


    res.json({
      url: url
    })
  } catch (error) {
    console.log(error);
    
    return next(error)
  }
})


paymentRouter.get("/success", async (req, res) => {
  const { payment } = req.query
  //TODO: THIS SHOULD NEVER HAPPEN
  if(!payment || typeof payment !== "string")throw new ApiError("Cannot retrive payment reference", 500);
  
  await PaymentController.transformPayment(payment)


  res.redirect("/")
})

paymentRouter.get("/cancel", (req, res) => {
  console.log("CANCEL", req.query);

  res.redirect("/")
})