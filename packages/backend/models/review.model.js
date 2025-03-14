import mongoose from "mongoose";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Book from "../models/book.model.js";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (value) {
          const user = await User.findById(value);
          if (user === null) return false;
          return true;
        },
        message: (props) => `User with ID ${props.value} does not exist.`,
      },
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      validate: {
        validator: async function (value) {
          const book = await Book.findById(value);
          if (book === null) return false;
          return true;
        },
        message: (props) => `Book with ID ${props.value} does not exist.`,
      },
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "rating can't be lower than 1"],
      max: [5, "rating can't be higher than 5"],
    },
    review: {
      type: String,
      required: true,
      minlength: [5, "review must be at least 5 characters long."],
      maxlength: [500, "review cannot exceed 500 characters."],
    },
  },
  { timestamps: true }
);

reviewSchema.pre("save", async function (next) {
  const existingReview = await Review.findOne({
    user: this.user,
    book: this.book,
  });

  if (existingReview) {
    return next(new Error("User has already reviewed this book."));
  }

  next();
});

reviewSchema.pre("save", async function (next) {
  console.log("Checking if user owns the book...");
  console.log("User ID:", this.user);
  console.log("Book ID:", this.book);
  const ownBook = await Order.findOne({
    user: this.user,
    "books.book": this.book,
    status: "Completed",
  });
  console.log("Order found:", ownBook);
  if (!ownBook) {
    console.log("Order not found:");
    return next(new Error("User doesn't own the book to review it"));
  }
  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
