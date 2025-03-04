import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: [String],
    required: true,
    validate: {
      validator(v) {
        return v.length > 0;
      },
      message: 'a book must have an author/s !'
    }
  },
  price: {
    type: Number,
    required: true,
    min: [0, "price can't be lower than 0"]
  },
  description: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "stock can't be lower than 0"]
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg)|[\w,\s-]+\.(?:png|jpg|jpeg|gif|svg))$/i.test(v);
      },
      message: 'Image must be a valid URL or filename ending in .png, .jpg, .jpeg, .gif, or .svg.'
    }
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {timestamps: true});

bookSchema.set('toJSON', {
  transform: (doc, {_id, title, author, price, description, stock, image, deletedAt}) => ({_id, title, author, price, description, stock, image, deletedAt})
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
