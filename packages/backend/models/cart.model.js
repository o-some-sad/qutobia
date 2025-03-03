//@ts-check
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    book: {
        type: mongoose.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
})


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    books: {
        type: [cartItemSchema],
        required: true,
        default: [],
        _id: false,
    }
})


const Cart = mongoose.model('Cart', cartSchema);
export default Cart;