import jwt from "jsonwebtoken";
import ApiError from "../utilities/ApiErrors.js";
/** @type {import("express").Handler} */
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new ApiError("Access denied, invalid token", 401);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; //send decoded payload to the next middleware
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
