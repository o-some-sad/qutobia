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
        status: {
            type: String,
            enum: ['Completed' , 'Processing' , 'Pending' , 'Cancelled'],
            default: 'Pending',
        },
        session: {
            type: String,
            required: true,
        }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual('totalPrice').get(function () {
    return this.books.reduce((total, book) => total + book.price * book.quantity, 0);
});

orderSchema.virtual('items').get(function () {
    return this.books.reduce((total, book) => total + book.quantity, 0);
});

const Order = mongoose.model('Order', orderSchema);
export default Order;