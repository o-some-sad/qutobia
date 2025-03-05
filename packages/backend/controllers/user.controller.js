import {userPasswordValidator, userValidator} from 'shared';
import User from "../models/user.model.js";
import nodemailer from 'nodemailer';
import fs from 'fs';
import { sendMail } from './mail.controller.js';


export const createUser = async (userData) => { // for test until we have register
  try {
    await userValidator.parseAsync(userData);
    return await User.create(userData);
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async (filters, page, limit) => {
  try {
    const count = await User.countDocuments(filters);
    const users = await User.find(filters).skip((page - 1) * limit).limit(limit).exec();
    return {totalPages: Math.ceil(count / limit), data: users};
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (id, userData) => {
  try {
    delete userData.password;
    await userValidator.partial().parseAsync(userData);
    return await User.findByIdAndUpdate(id, userData, {new: true});
  } catch (err) {
    throw err;
  }
};

export const updateUserPassword = async (id, userData) => {
  try {
    await userPasswordValidator.parseAsync(userData);
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    if (!await user.comparePassword(userData.oldPassword)) throw new Error('Old password is incorrect');
    user.password = userData.newPassword;
    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
}

export const updateUserImage = async (id, filePath) => {
  try {
    return await User.findByIdAndUpdate(id, { image: filePath }, {new: true});
  } catch (err) {
    throw err;
  }
};


export const userRegister = async(body, userEmail, username, password) => {
  // CHECK if ALL fields are full
  const isEmailRegistered = await User.exists({email: userEmail});
  const isUsernameRegistered = await User.exists({name: username});
  // CHECK if the username is taken
  if(username === undefined || userEmail === undefined || password === undefined){
    const err = new Error("All fields are required !");
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


    