import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "./mail.controller.js";
import fs from "fs";
import ApiError from "../utilities/ApiErrors.js";

export const handleLogin = async (email, password) => {
  if (!email || !password) {
    throw new ApiError("email and passwords are required", 400);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError("user not found", 404);
  }
  const isValidPass = await user.comparePassword(password);
  if (!isValidPass) {
    throw new ApiError("user or password are invalid", 400);
  }
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return {
    token,
    user,
  };
};

export const handleRegister = async (body) => {
  // CHECK if ALL fields are full
  const { email, name, password } = body;
  const isEmailRegistered = await User.exists({ email: email });
  const isUsernameRegistered = await User.exists({ name: name });
  //TODO: don't check if username already exist (just use it as human name)
  //TODO: figure out how to check if email is a valid email
  // CHECK if the username is taken
  if (name === undefined || email === undefined || password === undefined) {
    //TODO: use schema validator
    const err = new Error("username, email and password are required");
    err.status = 400;
    throw err;
  } else if (isUsernameRegistered !== null) {
    const err = new Error(
      "This username is already taken. Please choose a different one."
    );
    err.status = 400;
    throw err;
  }
  // CHECK if the user's email is taken
  else if (isEmailRegistered !== null) {
    const err = new Error(
      "This email is already in use. Please use a different email or log in."
    );
    err.status = 400;
    throw err;
  } else {
    // If the user's email/username is unavailable --> create user
    // call node-mailer
    const msg = fs.readFileSync("public/mailBody.html", "utf-8");
    sendMail(email, "Email Verification", msg);
    return await User.create(body);
  }
};

export const handleMe = async () => {}; //not needed, logic handled entirely in the router.
