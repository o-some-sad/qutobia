import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  handleLogin,
  handleLogout,
  handleMe,
} from "../controllers/auth.controller.js";
const Router = express.Router();

Router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await handleLogin(email, password);
    // res.cookie("token", result.token);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});
Router.post("/logout", async (req, res, next) => {}); //handled in the client-side if tokens were to be stored in the local storage
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

export default Router;
