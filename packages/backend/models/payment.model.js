//@ts-check
import mongoose, { Document } from 'mongoose';

const paymentItemSchema = {
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
    },
    price: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }
}


const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    books: {
        type: [paymentItemSchema],
        required: true,
        minItems: 1,
        _id: false
    },
    session: String
}, {timestamps: true})


const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;