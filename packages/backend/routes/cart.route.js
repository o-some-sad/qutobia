import express from 'express';
import mongoose from 'mongoose';
import * as cartController from '../controllers/cart.controller.js'
const cartRouter = express.Router();

// mocking user object
const user = {
    id: new mongoose.Types.ObjectId("67c383ec399b432beab55cd6"),
    role: "user"
}

cartRouter.get("/", (req, res)=>{
    res.status(500).json("not implemented yet")
})

// add a book to the cart 
cartRouter.post("/", async (req, res)=>{
    const result = await cartController.addItem({}, user.id)
    console.log(result);
    
    res.json({})
})

// remove a book from the cart by book id
cartRouter.delete("/:id", (req, res)=>{
    res.status(500).json("not implemented yet")
})

// clear all items from the cart
cartRouter.delete("/", (req, res)=>{
    res.status(500).json("not implemented yet")
})

export default cartRouter