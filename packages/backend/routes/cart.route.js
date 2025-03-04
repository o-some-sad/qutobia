//@ts-check
/// <reference path="../express.d.ts" />
import express from 'express';
import mongoose from 'mongoose';
import * as cartController from '../controllers/cart.controller.js'
import validateSchema from '../middlewares/zodValidator.middleware.js';
import { CartItemValidator, CartPropsValidator, CartValidator } from 'shared';
import { authMiddleware } from '../middlewares/auth.middleware.js'
const cartRouter = express.Router();


cartRouter.get("/", authMiddleware(), async (req, res, next) => {
        try {
            const { pick = [] } = req.query
            
            const cart = await cartController.getByUserId(req.user._id.toString(), CartPropsValidator.parse(pick))
            
            res.json(cart)
        } catch (error) {
            next(error)
        }

    })

// add a book to the cart 
cartRouter.post("/", authMiddleware(), validateSchema(CartItemValidator), async (req, res, next) => {
    try {
        if (req.user.role !== 'user') throw new Error("only users can use cart");
        console.log("!!!", req.body);
        
        const result = await cartController.addCartItem(req.body, req.user._id.toString())
        res.json({})
    } catch (error) {
        next(error)
    }
})

// remove a book from the cart by book id
cartRouter.delete("/:id", (req, res) => {
    console.log(req.body);

    res.status(500).json("not implemented yet")
})

// clear all items from the cart
cartRouter.delete("/", (req, res) => {
    res.status(500).json("not implemented yet")
})

export default cartRouter