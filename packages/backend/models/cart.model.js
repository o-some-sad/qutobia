//@ts-check
import mongoose, { Document } from 'mongoose';

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
    }
})

cartSchema.post('findOneAndUpdate', 
    /**
     * 
     * @param {Document} document 
     * @param {*} next 
     */
    async function (document, next) {
        const updatedDocument = await this.model.findOne(this.getFilter())
        updatedDocument.books = updatedDocument.books.filter(book => book.quantity > 0)
        await updatedDocument.save()        
    next()
})

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;