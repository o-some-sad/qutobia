import express from 'express';
import {createUser, getAllUsers, updateUser, updateUserImage, updateUserPassword, userRegister} from '../controllers/user.controller.js';
import {handleImageUpload} from "../middlewares/uploadImage.middleware.js";
import mongoose from 'mongoose';

const Router = express.Router();

Router.post('/', async (req, res, next) => { // for test until we have register
  const userData = req.body;
  try {
    const user = await createUser(userData);
    res.status(201).json({status: 'success', data: user});
  } catch (err) {
    next(err);
  }
});

Router.get('/', async (req, res, next) => {
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

Router.patch('/:id', async (req, res, next)=>{
  const [id, userData] = [req.params.id, req.body];
  try {
    const updatedUser = await updateUser(id, userData);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({status: 'success', data: updatedUser});
  } catch (err) {
    next(err);
  }
});

Router.patch('/:id/password', async (req, res, next)=>{
  const [id, userData] = [req.params.id, req.body];
  try {
    const updatedUser = await updateUserPassword(id, userData);
    res.status(200).json({status: 'success', data: updatedUser});
  } catch (err) {
    next(err);
  }
});

Router.patch('/:id/image', handleImageUpload('user'), async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await updateUserImage(id, req.file.path);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
});

Router.post('/register', async(req, res, next) => {
  let body = req.body;
  let userEmail = req.body.email;
  let username = req.body.name;
  let password = req.body.password;
  try{
    const registeredUser = await userRegister(body, userEmail, username, password);
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
