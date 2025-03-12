import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        books: {
            type: [{
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Book',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 0
                },
                price: {
                    type: Number,
                    required: true,
                }
            }],
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        items:{
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['Completed' , 'Processing' , 'Pending' , 'Cancelled'],
            default: 'Pending',
        },
        session:{
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);
const Order = mongoose.model('Order', orderSchema);
export default Order;