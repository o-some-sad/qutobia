import Review from "../models/review.model.js";
export const addReview = async (req, res, next) => {
  try {
    const reviewData = { ...req.body };
    const review = await Review.create(reviewData);
    return res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};
export const getAllReviewsByBookId = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const reviews = await Review.find({ bookId });
    return res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};
// export const updateReview = (req, res) => {};
// export const deleteReview = (req, res) => {};
