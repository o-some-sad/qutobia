//@ts-check
/// <reference path="../express.d.ts" />
import express from 'express';
import * as cartController from '../controllers/cart.controller.js'
import validateSchema from '../middlewares/zodValidator.middleware.js';
import { CartItemValidator } from 'shared';
import { authenticateToken } from '../middlewares/authenticateToken.js';
const cartRouter = express.Router();


cartRouter.get("/", authenticateToken, async (req, res, next) => {
    console.log(req.user);
    
    try {

        const cart = await cartController.getByUserId(req.user._id.toString())

        res.json(cart)
    } catch (error) {
        next(error)
    }

})

// add a book to the cart 
cartRouter.post("/", authenticateToken, validateSchema(CartItemValidator), async (req, res, next) => {
    try {
        if (req.user.role !== 'user') throw new Error("only users can use cart");
        console.log("!!!", req.body);

        await cartController.addCartItem(req.body, req.user._id.toString())
        res.json({})
    } catch (error) {
        next(error)
    }
})

// remove a book from the cart by book id
cartRouter.delete("/:id", authenticateToken, async (req, res, next) => {
    try {
        if (req.user.role !== 'user') throw new Error("only users can use cart");
        const result = await cartController.removeCartItem(req.params.id, req.user._id.toString())
        if(result){
            res.json({})
            return
        }
            else throw new Error("Item not found in cart")
        }catch(error){
        next(error)
    }
})

// clear all items from the cart
cartRouter.delete("/", (req, res) => {
    res.status(500).json("not implemented yet")
})

export default cartRouter