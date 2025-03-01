import express from 'express';
import {createUser, updateUser} from '../controllers/user.controller.js';

const Router = express.Router();

Router.post('/', createUser); // for test until we have register
Router.patch('/:id', updateUser);

export default Router;
