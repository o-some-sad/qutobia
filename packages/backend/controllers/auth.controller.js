import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "./mail.controller.js";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import ApiError from "../utilities/ApiErrors.js";

dotenv.config();
const ZEROBOUNCE_API_KEY = process.env.ZEROBOUNCE_API_KEY;

const validateEmail = async (email) => {
  try {
    const response = await axios.get("https://api.zerobounce.net/v2/validate", {
      params: {
        api_key: ZEROBOUNCE_API_KEY,
        email: email,
      },
    });

    const status = response.data.status;
    if (status === "valid") return true;
    return false;
  } catch (error) {
    console.error("Error validating email:", error);
    throw new ApiError("Failed to validate email. Please try again.", 500);
  }
};

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
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return {
    token,
    user,
  };
};

export const handleRegister = async (body) => {
  // CHECK if ALL fields are full
  const { email, name, password } = body;
  const isEmailRegistered = await User.exists({ email: email });
  // const isUsernameRegistered = await User.exists({ name: name });

  
  // CHECK if the username is taken
  if (name === undefined || email === undefined || password === undefined) {
    //TODO: use schema validator
    const err = new Error("username, email and password are required");
    err.status = 400;
    throw err;
  }
  // CHECK if the user's email is taken
  if (isEmailRegistered !== null) {
    throw new ApiError("This email is already in use. Please use a different email or log in.");
  }
  if (process.env.ENVIORNMENT === "production") {
    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
      throw new ApiError("The provided email is invalid or doesn't exist", 400);
    }
  }
  // If the user's email/username is unavailable --> create user
  // call node-mailer
  const msg = fs.readFileSync("public/mailBody.html", "utf-8");
  sendMail(email, "Email Verification", msg);
  return await User.create(body);
};

export const handleMe = async () => {}; //not needed, logic handled entirely in the router.
