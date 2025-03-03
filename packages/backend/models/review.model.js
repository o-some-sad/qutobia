import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
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
          const book = await mongoose.model("Book").findById(value);
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
      max: [10, "rating can't be higher than 10"],
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
  const existingReview = await mongoose.model("Review").findOne({
    user: this.user,
    book: this.book,
  });

  if (existingReview) {
    return next(new Error("User has already reviewed this book."));
  }

  next();
});
const Review = mongoose.model("Review", reviewSchema);
export default Review;
