import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import {
  handleLogin,
  handleMe,
  handleRegister
} from "../controllers/auth.controller.js";
const Router = express.Router();

Router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await handleLogin(email, password);
    res.cookie('token', result.token, { httpOnly: true, secure: false});
    res.status(200).json(result.user);
  } catch (err) {
    next(err);
  }
});
Router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully!" });
});
Router.get("/me", async (req, res, next) => {
  //authenticateToken should be called as a middleware
  //returns object of currently logged-in the user
  try {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId }, { password: 0 });
    if (!user) {
      const err = new Error("user not found");
      err.status = 404;
      throw err;
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

Router.post('/register', async(req, res, next) => {
  try{
    const registeredUser = await handleRegister(req.body);
    return res.status(200).json({data: registeredUser });
  }
  catch(err){
    if(err instanceof mongoose.Error.ValidationError){
      return res.status(400).json({status: 'fail', message: "Validation Error !"});
    }
    next(err);
  }
});

export default Router;
