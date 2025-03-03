//@ts-check
import express from 'express';
import mongoose from 'mongoose';
import * as cartController from '../controllers/cart.controller.js'
import validateSchema from '../middlewares/zodValidator.middleware.js';
import { CartItemValidator, CartValidator } from 'shared';
const cartRouter = express.Router();

// mocking user object
const user = {
    id: new mongoose.Types.ObjectId("67c383ec399b432beab55cd6"),
    role: "user"
}

cartRouter.get("/", async (req, res, next)=>{
    try{
        const cart = await cartController.getByUserId(user.id.toString())
        res.json(cart)
    }catch(error){
        next(error)
    }

})

// add a book to the cart 
cartRouter.post("/", validateSchema(CartItemValidator), async (req, res, next)=>{
    try{
        const result = await cartController.addCartItem(req.body, user.id)    
        res.json({})
    }catch(error){
        next(error)
    }
})

// remove a book from the cart by book id
cartRouter.delete("/:id", (req, res)=>{
    console.log(req.body);
    
    res.status(500).json("not implemented yet")
})

// clear all items from the cart
cartRouter.delete("/", (req, res)=>{
    res.status(500).json("not implemented yet")
})

export default cartRouter