import express from 'express';
import {createUser, updateUser, updateUserImage, updateUserPassword} from '../controllers/user.controller.js';
import {handleImageUpload} from "../middlewares/uploadImage.middleware.js";
import {uploadUserImage} from "../utilities/cloudinaryConfig.js";
import {catchError} from "../utilities/catchError.js";

const Router = express.Router();

Router.post('/', async (req, res) => { // for test until we have register
  const userData = req.body;
  try {
    const user = await createUser(userData);
    res.status(201).json({status: 'success', data: user});
  } catch (err) {
    catchError(err, res);
  }
});

Router.patch('/:id', async (req, res)=>{
  const [id, userData] = [req.params.id, req.body];
  try {
    const updatedUser = await updateUser(id, userData);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({status: 'success', data: updatedUser});
  } catch (err) {
    catchError(err, res);
  }
});

Router.patch('/:id/password', async (req, res)=>{
  const [id, userData] = [req.params.id, req.body];
  try {
    const updatedUser = await updateUserPassword(id, userData);
    res.status(200).json({status: 'success', data: updatedUser});
  } catch (err) {
    catchError(err, res);
  }
});

Router.patch('/:id/image', handleImageUpload('user'), async (req, res) => {
  const id = req.params.id;
  try {
    const user = await updateUserImage(id, req.file.path);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    catchError(err, res);
  }
});

export default Router;
