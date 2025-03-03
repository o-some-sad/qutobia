import express from 'express';
import Order from '../models/order.model.js';
import { createOrder, getById, updateOrder } from '../controllers/order.controller.js';


const router = express.Router();

router.route('/')
    .get((req, res) => {

        //const user ={isAdmin:true,}
        res.json({ message: "orders" })
    })
    .post(createOrder);

router.route('/:id')
    .get(getById)
    .patch(updateOrder);


export default router;