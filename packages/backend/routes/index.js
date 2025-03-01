import express from 'express';
import bookRouter from './book.route.js';
import userRouter from './user.route.js';
import reviewRouter from "./review.route.js";

const Router = express.Router();

Router.use('/books', bookRouter);
Router.use('/users', userRouter);
Router.use('/reviews', reviewRouter);
Router.all('*', (req, res) => res.status(404).json({status: 'fail', message: 'Route not found'}));

export default Router;
