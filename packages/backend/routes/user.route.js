import express from 'express';
import {getAllUsers, updateUser, updateUserImage, updateUserPassword} from '../controllers/user.controller.js';
import {handleImageUpload} from "../middlewares/uploadImage.middleware.js";
import {authenticateToken} from "../middlewares/authenticateToken.js";
import {isAdmin} from "../middlewares/isAdmin.js";

const Router = express.Router();

Router.get('/', authenticateToken, isAdmin, async (req, res, next) => {
  const filters = {};
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  try {
    if(req.query.role) filters.role = req.query.role;
    if(req.query.name) filters.name = { $regex: req.query.name, $options: 'i' };
    const users = await getAllUsers(filters, page, limit);
    res.status(200).json({totalPages: users.totalPages, data: users.data});
  } catch (err) {
    next(err);
  }
});

Router.patch('/:id', authenticateToken, async (req, res, next)=>{
  const [id, userData] = [req.params.id, req.body];
  try {
    const updatedUser = await updateUser(id, userData);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({status: 'success', data: updatedUser});
  } catch (err) {
    next(err);
  }
});

Router.patch('/:id/password', authenticateToken, async (req, res, next)=>{
  const [id, userData] = [req.params.id, req.body];
  try {
    const updatedUser = await updateUserPassword(id, userData);
    res.status(200).json({status: 'success', data: updatedUser});
  } catch (err) {
    next(err);
  }
});

Router.patch('/:id/image', authenticateToken, handleImageUpload('user'), async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await updateUserImage(id, req.file.path);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
});

export default Router;
