import express from 'express';
import bookRouter from './book.route.js'

const router = express.Router();

router.use('/api', bookRouter);

export default router;