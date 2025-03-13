import express from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import {
  handleForgetPassword,
  handleLogin,
  handleRegister, handleResetPassword, handleVerifyEmail,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import ApiError from "../utilities/ApiErrors.js";
import validateSchema from "../middlewares/zodValidator.middleware.js";
import { registerValidator } from "shared/register.validator.js";
const Router = express.Router();

Router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokenAndUser = await handleLogin(email, password);
    res.cookie("token", tokenAndUser.token, { httpOnly: true, secure: false,sameSite:"lax" });
    res.status(200).json(tokenAndUser); //send token and user to the clientSide
  } catch (err) {
    next(err);
  }
});

Router.get("/logout", (req, res) => {
  console.log(7531);
  
  res.clearCookie("token", { httpOnly: true, secure: true });
  res.json({ message: "Logged out successfully!" });
});

Router.get("/me", authenticateToken, async (req, res, next) => {
  //authenticateToken should be called as a middleware
  //returns object of currently logged-in the user
  try {
    let user = req.user;
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

Router.post("/register",validateSchema(registerValidator), async (req, res, next) => {
  try {
    const registeredUser = await handleRegister(req.body);
    return res.status(200).json({ data: registeredUser });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ status: "fail", message: "Validation Error !" });
    }
    next(err);
  }
});

Router.post("/verify", async (req, res, next) => {
  try {
    const tokenAndUser = await handleVerifyEmail(req.body.userId);
    res.cookie("token", tokenAndUser.token, { httpOnly: true, secure: false, sameSite:"lax" });
    return res.status(200).json({ message: "Email verified successfully", data: tokenAndUser.user });
  } catch (err) {
    next(err);
  }
});

Router.post('/forget-password', async (req, res, next) => {
  try {
    await handleForgetPassword(req.body.email);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    next(err);
  }
});

Router.post("/reset-password", async (req, res, next) => {
  try {
    const user = await handleResetPassword(req.body);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

export default Router;
