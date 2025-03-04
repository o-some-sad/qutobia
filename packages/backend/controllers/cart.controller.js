//@ts-check
import Cart from "../models/cart.model.js";
import { CartItemValidator, CartPopulatedValidator, CartPropsValidator, CartValidator } from 'shared'
import mongoose from 'mongoose'
import Book from "../models/book.model.js";
import { z } from "zod";
/**
 * 
 * @param {Zod.infer<typeof CartItemValidator>} payload 
 * @param {*} user 
 */
export const addCartItem = async (payload, user) => {
    let cart = await Cart.findOne({
        user
    })    
    if (!cart) {        
        cart = await Cart.create({
            user,
            books: []
        })
    }    

    const book = await Book.findById(payload.book)
    if (!book) throw new Error("Book not found")

    const cartItemRef = cart.books.find(item => item.book.toString() === payload.book.toString())
    
    if (cartItemRef) {
        cartItemRef.quantity += payload.quantity;
        if (cartItemRef.quantity > book.stock) throw new Error("No enough stock of this book");        
        await cart.updateOne({
            $set: {
                books: cart.books
            }
        })
        return;
    } else {
        if (payload.quantity > book.stock) throw new Error("No enough stock of this book")
        await cart.updateOne({
            $push: {
                books: {
                    book: new mongoose.Types.ObjectId(payload.book),
                    quantity: payload.quantity
                }
            }
        })
        return;
    }
};


/**
 * 
 * @param {string} user 
 * @param {z.infer<typeof CartPropsValidator>} props
 */
export const getByUserId = async (user, props = ["price", "title"])=>{

        
    const cart = await Cart.findOne({
        user
    }).populate("books.book", props.join(" "))
    // .then(cart=>CartPopulatedValidator.parse(cart || { user }))    
    return cart
}
