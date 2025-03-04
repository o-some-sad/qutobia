import express from 'express';
import { createOrder, getById, updateOrder, getAllOrder } from '../controllers/order.controller.js';


const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        const isAdmin = false;
        const order = await getAllOrder(isAdmin);
        res.json({ order })

    })
    .post(async (req, res, next) => {
        try {
            const orders = await createOrder(req.body)
            console.log(orders);

            res.status(201).json({ orders });
        } catch (error) {
            next(error)
        }
    });

router.route('/:id')
    .get(async (req, res, next) => {
        try {
            const order = await getById(req.params.id)
            if (order.length == 0) {
                res.status(400).json({ error: "not valid ID" });

            } else {
                res.status(200).json({
                    message: "Success",
                    order
                })
            }

        }
        catch (error) {
            next(error)
        }
    })
    .patch(async (req, res, next) => {
        try {
            const { id } = req.params;
            const updatedOrder = await updateOrder(req.body, id)
            if (!updatedOrder) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(updatedOrder);
        } catch (error) {
            next(error)
        }
    });


export default router;