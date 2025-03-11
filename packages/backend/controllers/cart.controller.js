//@ts-check
import Cart from "../models/cart.model.js";
// V these values are being used as jsdoc types
// eslint-disable-next-line no-unused-vars
import { CartItemValidator, CartPopulatedValidator, CartPropsValidator, CartValidator } from 'shared'
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
 * @param {string} book 
 * @param {string} user 
 * @param {boolean} completely 
 */
export const removeCartItem = async (book, user, quantity = 1, completely = false) => {
    if (completely) throw new Error("not implemented yet");
    return await Cart.findOneAndUpdate({
        user: user,
        "books.book": new mongoose.Types.ObjectId(book)
    },
        {
            $inc: {
                //it's safe to delete whatever quantity is, there's a post-hook on the cart schema that ensures the below-zero items will be deleted
                "books.$.quantity": -quantity
            }
        })
}


/**
 * 
 * @param {string} user 
 */
export const getByUserId = async (user) => {
    const fields = ["title", "price", "author", "image", "stock"]
    const cart = await Cart.findOne({
        user
    }).populate("books.book", fields.join(" "))
    .then(cart=>CartPopulatedValidator.parse(cart || { user }))    
    return cart
}


