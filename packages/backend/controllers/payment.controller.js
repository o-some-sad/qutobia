//@ts-check
import mongoose from "mongoose";
import Book from "../models/book.model.js";
import Cart from "../models/cart.model.js";
import Payment from "../models/payment.model.js";
import ApiError from "../utilities/apiError.js"
import { Stripe } from 'stripe'



//TODO: create a function ensures that specefic env vars are present
const STRIPE_SECRET = process.env.STRIPE_SECRET;
if (!STRIPE_SECRET) throw new Error("STRIPE_SECRET is required to run the app")

const APP_URL = process.env.APP_URL
if(!APP_URL)throw new Error("APP_URL is required to run the app")

const stripe = new Stripe(STRIPE_SECRET)


/**
 * 
 * @param {string} userId 
 */
export const createPaymentFromUserId = async (userId) => {
    const cart = await Cart.findOne({ user: userId })
    if (!cart || cart.books.length === 0) throw new ApiError("Cannot checkout an empty cart", 400);

    const books = new Map(await Book.find({
        $or: cart.books.map(item => ({ _id: item.book }))
    }, {
        price: 1,
        title: 1,
    }).then(d => d.map(({ price, title, _id }) => [_id.toString(), { price, title }])))

    const payment = await Payment.create({
        user: userId,
        books: cart.books.map(item => ({
            book: item.book,
            quantity: item.quantity,
            price: books.get(item.book.toString())?.price,
            title: books.get(item.book.toString())?.title
        }))
    })

    const baseUrl = new URL(APP_URL)

    const successUrl = new URL("/api/payment/success", baseUrl)
    successUrl.searchParams.set("payment", payment._id.toString())

    const cancelUrl = new URL("/api/payment/cancel", baseUrl)
    cancelUrl.searchParams.set("payment", payment._id.toString())

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: payment.books.map(item => ({
            price_data: {
                currency: 'usd',
                unit_amount: item.price * 100, //PRICE IS IN CENTS
                product_data: {
                    name: item.title
                }
            },
            quantity: item.quantity
        })),
        success_url: successUrl.toString(),
        cancel_url: cancelUrl.toString(),
    })

    await payment.updateOne({
        $set: {
            session: session.id
        }
    })

    return session.url
}

/**
 * 
 * @param {string} paymentId 
 */
export const transformPayment = async (paymentId) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const payment = await Payment.findById(paymentId, undefined, { session })
            if (!payment) throw new Error("cannot find payment"); //THIS SHOULD NEVER HAPPEN (except in case of messing with data manually)
            await Cart.deleteOne({ user: payment.user }, { session })

            console.log(payment);
            


            await session.commitTransaction()
        });
    } catch (error) {
        console.error('Transaction failed:', error);
    } finally {
        session.endSession();
    }
}



// setTimeout(async () => {
//     await transformPayment("67ca57f65810a1fc60e0c1fe")
// }, 0);