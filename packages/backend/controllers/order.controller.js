import Order from "../models/order.model.js";
import { updateOrderValidator } from "../../shared/index.js";

export const getById = async (Id) => {
  return await Order.find({ user: Id }).sort({updatedAt:-1}).populate("user", "name")
    .populate("books.book")
    .exec();
};

export const updateOrder = async (data, id) => {
  const validatedData = updateOrderValidator.parse(data);
  return await Order.findByIdAndUpdate(id, validatedData, { new: true });
};

export const getAllOrder = async () => {
  return await Order.find().sort({updatedAt:-1}).populate("user", "name")
    .populate("books.book", "title")
    .exec();
};
