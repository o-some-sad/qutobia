import express from 'express';
import {createUser, updateUser, updateUserImage} from '../controllers/user.controller.js';
import {uploadUserImage} from "../utilities/cloudinaryConfig.js";

const Router = express.Router();

Router.post('/', createUser); // for test until we have register
Router.patch('/:id', updateUser);
Router.patch('/:id/image', uploadUserImage.single('image'), updateUserImage);

export default Router;
