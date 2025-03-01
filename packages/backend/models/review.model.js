import mongoose from 'mongoose';

// one review for one book made by one user.
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'rating can\'t be lower than 1'],
      max: [10, 'rating can\'t be higher than 10']
    },
    review: {
      type: String,
      required: true,
      minlength: [5, 'review must be at least 5 characters long.'],
      maxlength: [500, 'review cannot exceed 500 characters.']
    }
  },
  {timestamps: true}
);
// optional for future consideration: add reply field/ deleted field
const Review = mongoose.model('Review', reviewSchema);
export default Review;
