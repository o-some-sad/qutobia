import {userPasswordValidator, updateUserValidator} from 'shared';
import User from "../models/user.model.js";

export const getAllUsers = async (filters, page, limit) => {
  const count = await User.countDocuments(filters);
  const users = await User.find(filters).skip((page - 1) * limit).limit(limit).exec();
  return {totalPages: Math.ceil(count / limit), data: users};
};

export const updateUser = async (id, userData) => {
  delete userData.image;
  delete userData.email;
  delete userData.password;
  await updateUserValidator.parseAsync(userData);
  return await User.findByIdAndUpdate(id, userData, {new: true});
};

export const updateUserPassword = async (id, userData) => {
  await userPasswordValidator.parseAsync(userData);
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  if (!await user.comparePassword(userData.currentPassword)) throw new Error('current password is incorrect');
  user.password = userData.newPassword;
  await user.save();
  return user;
}

export const updateUserImage = async (id, filePath) => {
  return await User.findByIdAndUpdate(id, { image: filePath }, {new: true});

};


    