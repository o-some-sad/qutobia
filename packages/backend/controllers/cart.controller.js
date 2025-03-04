//@ts-check
import Cart from "../models/cart.model.js";
import { CartItemValidator, CartPopulatedValidator, CartValidator } from 'shared'
import mongoose from 'mongoose'
import Book from "../models/book.model.js";

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
    console.log(cart);
    
    if (cartItemRef) {
        cartItemRef.quantity += payload.quantity;
        if (cartItemRef.quantity > book.stock) throw new Error("No enough stock of this book");
        await cart.updateOne({
            $set: {
                books: cart.books
            }
        })
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
    }
};


/**
 * 
 * @param {string} user 
 */
export const getByUserId = async (user)=>{
    const cart = await Cart.findOne({
        user
    }).populate("books.book", "price title")
    .then(cart=>CartPopulatedValidator.parse(cart || { user }))
    return cart
}
