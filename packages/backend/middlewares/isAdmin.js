import ApiError from "../utilities/apiError.js";

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new ApiError("Access denied. Admin role required.", 403));
  }
  next();
};
