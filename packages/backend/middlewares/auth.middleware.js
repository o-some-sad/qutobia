//@ts-check
import { z } from "zod";
import { userValidator } from "shared";
import User, { userSchema } from "../models/user.model.js";

/**
 * @typedef {import('express').Request & { user: MyUserType }} CustomRequest
 */

/**
 * @typedef {import("mongoose").InferSchemaType<userSchema>} MyUserType
 */

/**@typedef {(req: CustomRequest, res: import("express").Response, next: import("express").NextFunction, value: any, name: string) => Promise<any>} CustomHandler */

/**
 *
 * @param {boolean} adminOnly
 * @returns {import("express").Handler}
 */
export function authMiddleware(adminOnly = false) {
  /**@type {CustomHandler} */
  //@ts-ignore
  return async (req, res, next) => {
    const user = await User.findById("67c38059cacfc69180d9c66d");
    if (!user) return next(new Error("not authenticated"));
    req.user = user;
    next();
  };
}
