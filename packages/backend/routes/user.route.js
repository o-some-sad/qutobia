import express from "express";
import {
  getAllUsers,
  updateUser,
  updateUserImage,
  updateUserPassword,
} from "../controllers/user.controller.js";
import { handleImageUpload } from "../middlewares/uploadImage.middleware.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import redisClient from "../utilities/redisClient.js";

const Router = express.Router();

Router.get("/", authenticateToken, isAdmin, async (req, res, next) => {
  const filters = {};
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  try {
    if (req.query.role) filters.role = req.query.role;
    if (req.query.name)
      filters.name = { $regex: req.query.name, $options: "i" };
    const users = await getAllUsers(filters, page, limit);
    res.status(200).json({ totalPages: users.totalPages, data: users.data });
  } catch (err) {
    next(err);
  }
});

Router.patch("/:id", authenticateToken, async (req, res, next) => {
  const [id, userData] = [req.params.id, req.body];
  try {
    if(req.user?.role === "user") delete userData.role;
    const updatedUser = await updateUser(id, userData);
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    await redisClient.del(`me:${id}`);
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (err) {
    next(err);
  }
});

Router.patch("/:id/password", authenticateToken, async (req, res, next) => {
  const [id, userData] = [req.params.id, req.body];
  try {
    if(req.user?._id !== id) return res.status(401).json({ message: "Unauthorized to change password for another user" });
    const updatedUser = await updateUserPassword(id, userData);
    await redisClient.del(`me:${id}`);
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (err) {
    next(err);
  }
});

Router.patch(
  "/:id/image",
  authenticateToken,
  handleImageUpload("user"),
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const user = await updateUserImage(id, req.file.path);
      await redisClient.del(`me:${id}`);
      res.status(200).json({ status: "success", data: user });
    } catch (err) {
      next(err);
    }
  }
);

export default Router;
