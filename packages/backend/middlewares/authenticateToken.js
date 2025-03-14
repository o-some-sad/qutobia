import jwt from "jsonwebtoken";
import ApiError from "../utilities/ApiErrors.js";
/** @type {import("express").Handler & { noClear: import("express").Handler }} */
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization;
    if (!token) throw new ApiError("Access denied, invalid token", 401);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user;
    next();
  } catch {
    res.clearCookie("token", { httpOnly: true, secure: true });
    next(new ApiError("Invalid token", 401))
  }
};

/** @type {import("express").Handler} */
authenticateToken.noClear = function(req, res, next){
  try {
    const token = req.cookies.token || req.headers.authorization;
    if (!token) throw new ApiError("Access denied, invalid token", 401);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user;
    next();
  } catch {
    next(new ApiError("Invalid token", 401))
  }
}