import express from 'express';
import mongoose from 'mongoose';
const cartRouter = express.Router();

cartRouter.get("/", (req, res)=>{
    // mocking user object
    const user = {
        id: new mongoose.Types.ObjectId("67c383ec399b432beab55cd6"),
        role: "user"
    }
})

// add a book to the cart 
cartRouter.post("/", (req, res)=>{
    res.status(500).json("not implemented yet")
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