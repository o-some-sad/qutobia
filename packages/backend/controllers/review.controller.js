//@ts-check
import Review from "../models/review.model.js";
import ApiError from "../utilities/ApiErrors.js";
export const addReview = async (reviewData) => {
  const reviewDataObj = { ...reviewData };
  //validate the object before adding it, not needed so far
  const review = await Review.create(reviewDataObj);
  return review;
};

export const getAllReviewsByBookId = async (bookId) => {
  const reviews = await Review.find({ book: bookId })
    .populate("user", "name")
    .populate("book", "title")
    .exec();
  if (reviews.length === 0) {
    throw new ApiError("review not found", 404);
  }
  return reviews;
};

export const updateReviewById = async (reviewId, updatedFields) => {
  //authorization still nedded
  //any extra fields will be accepted but not added to the database.
  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { ...updatedFields },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedReview) {
    throw new ApiError("review doesn't exist", 404);
  }
  return updatedReview;
};

export const deleteReviewById = async (reviewId) => {
  //authorization needed
  const deleted = await Review.deleteOne({ _id: reviewId });
  if (deleted.deletedCount === 0) {
    throw new ApiError("review not found", 404);
  }
};
