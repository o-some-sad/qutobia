import Order from '../models/order.model.js';
import { orderValidator, updateOrderValidator } from '../../shared/index.js';

export const createOrder = async (req, res) => {
    try {
        const order = req.body;
        const totalPrice = order.books.reduce((total, book) => total + book.price * book.quantity, 0);
        order.totalPrice = totalPrice;
        await orderValidator.parseAsync(order);
        const orders = await Order.create(order);
        res.json({ orders });
    } catch (error) {
        res.status(400).json({ error: error.errors });
    }
}

export const getById = async (req, res) => {
    try {
        const order = await Order.find({ _id: req.params.id });
        if (order.length == 0) {
            res.status(400).json({ error: "not valid ID" });
            return;
        }
        res.status(200).json({
            message: "Success",
            order
        })
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const validatedData = updateOrderValidator.parse(req.body);
        const { id } = req.params;
        const totalPrice = validatedData.books.reduce((total, book) => total + book.price * book.quantity, 0);
        validatedData.totalPrice = totalPrice;
        const updatedOrder = await Order.findByIdAndUpdate(id, validatedData, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.errors });
    }
}