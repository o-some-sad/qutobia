import {userPasswordValidator, userValidator} from 'shared';
import User from "../models/user.model.js";

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
