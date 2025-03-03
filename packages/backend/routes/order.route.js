import express from 'express';
import { createOrder, getById, updateOrder, getAllOrder } from '../controllers/order.controller.js';


const router = express.Router();

router.route('/')
    .get(getAllOrder)
    .post(createOrder);

router.route('/:id')
    .get(getById)
    .patch(updateOrder);


export default router;