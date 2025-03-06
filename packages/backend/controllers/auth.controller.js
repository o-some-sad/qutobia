import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "./mail.controller.js";
import fs from 'fs';

export const handleLogin = async (email, password) => {
  if (!email || !password) {
    const err = new Error("email and passwords are required");
    err.status = 400;
    throw err;
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const err = new Error("user not found");
    err.status = 404;
    throw err;
  }
  const isValidPass = await user.comparePassword(password);
  if (!isValidPass) {
    const err = new Error("email or password are invalid");
    err.status = 400;
    throw err;
  }
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return {
    token,
    user
  };
};

export const handleRegister = async(body) => {
  // CHECK if ALL fields are full
  const{userEmail,username,password}=body;
  const isEmailRegistered = await User.exists({email: userEmail});
  const isUsernameRegistered = await User.exists({name: username});
  //TODO: don't check if username already exist (just use it as human name)
  //TODO: figure out how to check if email is a valid email
  // CHECK if the username is taken
  if(username === undefined || userEmail === undefined || password === undefined){
    //TODO: use schema validator
    const err = new Error("username, email and password are required");
    err.status = 400;
    throw err;
  }
  else if(isUsernameRegistered !== null){
    const err = new Error("This username is already taken. Please choose a different one.");
    err.status = 400;
    throw err;
  }
  // CHECK if the user's email is taken
  else if (isEmailRegistered !== null){
    const err = new Error("This email is already in use. Please use a different email or log in.");
    err.status = 400;
    throw err;
  }
  else{  // If the user's email/username is unavailable --> create user
    // call node-mailer
    const msg = fs.readFileSync('public/mailBody.html', 'utf-8');
    sendMail(userEmail, "Email Verification", msg);
    return await User.create(body);
  }
};

export const handleMe = async () => {}; //not needed, logic handled entirely in the router.
