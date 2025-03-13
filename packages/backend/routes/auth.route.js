import express from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import {
  generateNewToken,
  handleLogin,
  handleRegister,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import ApiError from "../utilities/ApiErrors.js";
import validateSchema from "../middlewares/zodValidator.middleware.js";
import { registerValidator } from "shared/register.validator.js";
import redisClient from "../utilities/redisClient.js";

const Router = express.Router();

Router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokenAndUser = await handleLogin(email, password);
    res.cookie("token", tokenAndUser.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    redisClient.set(
      `me:${tokenAndUser.token}`,
      JSON.stringify(tokenAndUser.user),
      "EX",
      3600
    );
    res.status(200).json(tokenAndUser); //send token and user to the clientSide
  } catch (err) {
    next(err);
  }
});

Router.get("/logout", (req, res) => {  
  res.clearCookie("token", { httpOnly: true, secure: true });
  res.json({ message: "Logged out successfully!" });
});

Router.get("/me", authenticateToken, async (req, res, next) => {
  //authenticateToken should be called as a middleware
  //returns object of currently logged-in the user
  try {
    const  tokenUser = req.user;
    if (!tokenUser) {
      throw new ApiError("user not found", 404);
    }
    //TODO: add cache layer for user object
    const user = await User.findById(req.user._id);
    if(user.role !== tokenUser.role){
      const token = generateNewToken(user)
      res.cookie("token", token, { httpOnly: true, secure: false,sameSite:"lax" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

Router.post(
  "/register",
  validateSchema(registerValidator),
  async (req, res, next) => {
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
  }
);

export default Router;
