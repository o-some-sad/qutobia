//@ts-check
// dummy objects for testing
import dotenv from 'dotenv'
import Book from '../models/book.model.js'
import Review from '../models/review.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose'

dotenv.config({
  path: "../.env"
})

const MONGODB_URL = process.env.MONGODB_URL
if (!MONGODB_URL) throw new Error("MONGODB_URL is required");
mongoose.connect(MONGODB_URL)


const book_1_oid = new mongoose.Types.ObjectId();
const book_2_oid = new mongoose.Types.ObjectId();
const book_3_oid = new mongoose.Types.ObjectId();

const user_1_oid = new mongoose.Types.ObjectId();
const user_2_oid = new mongoose.Types.ObjectId();
const user_3_oid = new mongoose.Types.ObjectId();

const review_1_oid = new mongoose.Types.ObjectId();
const review_2_oid = new mongoose.Types.ObjectId();
const review_3_oid = new mongoose.Types.ObjectId();



const books = [
  {
    "_id": book_1_oid,
    title: "JavaScript: The Good Parts",
    author: ["Douglas Crockford"],
    price: 29.99,
    description: "A deep dive into the best features of JavaScript.",
    stock: 10,
    image: "https://example.com/javascript-good-parts.jpg",
  },
  {
    "_id": book_2_oid,
    title: "Clean Code",
    author: ["Robert C. Martin"],
    price: 35.5,
    description: "A guide to writing clean, maintainable code.",
    stock: 5,
    image: "https://example.com/clean-code.jpg",
  },
  {
    "_id": book_3_oid,
    title: "You Don’t Know JS",
    author: ["Kyle Simpson"],
    price: 25.0,
    description: "A comprehensive book series on JavaScript's inner workings.",
    stock: 15,
    image: "book-cover-you-dont-know-js.png",
  },
];

for await (const book of books) {
  console.log('adding book', book.title);
  await Book.create(book)
}


const users = [
  {
    _id: user_1_oid,
    name: "John Doe",
    email: "johndoe@example.com",
    password: "securepassword123",
    role: "admin",
    image: "https://example.com/john-doe.jpg",
  },
  {
    _id: user_2_oid,
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: "mypassword456",
    role: "user",
    image: "profile-pic-jane.png",
  },
  {
    _id: user_3_oid,
    name: "Alice Brown",
    email: "alicebrown@example.com",
    password: "aliceSecure789",
    role: "user",
    image: null,
  },
];

for await (const user of users) {
  console.log('adding user', user.name);
  await User.create(user)
}



const reviews = [
  {
    _id: review_1_oid,
    user: user_1_oid, // Example ObjectId for a user
    book: book_1_oid, // Example ObjectId for a book
    rating: 9,
    review: "An amazing book that provides deep insights into JavaScript!",
  },
  {
    _id: review_2_oid,

    user: user_2_oid,
    book: book_1_oid,
    rating: 7,
    review:
      "Good book overall, but some concepts were a bit challenging to grasp.",
  },
  {
    _id: review_3_oid,
    user: user_1_oid,
    book: book_2_oid,
    rating: 10,
    review: "One of the best books I have ever read. Highly recommended!",
  },
];

for await (const review of reviews) {
  console.log('adding review', review.user);
  await Review.create(review)
}

// const carts = [];

// const orders = [];


await mongoose.disconnect()