import Order from "../models/order.model.js";
import { orderValidator, updateOrderValidator } from "../../shared/index.js";

export const createOrder = async (order) => {
  const totalPrice = order.books.reduce(
    (total, book) => total + book.price * book.quantity,
    0
  );
  const items= order.books.reduce(
    (total, book) => total + book.quantity,
    0
  );
  order.totalPrice = totalPrice;
  order.items = items;
  console.log(items);
  await orderValidator.parseAsync(order);
  return await Order.create(order);
};

export const getById = async (Id) => {
  return await Order.find({ user: Id }).populate("user", "name")
  .populate("books.book")
  .exec();
};

export const updateOrder = async (data, id) => {
  const validatedData = updateOrderValidator.parse(data);
    return await Order.findByIdAndUpdate(id, validatedData, { new: true });
};

export const getAllOrder = async (user) => {
  const isAdmin = true;
  // user.role === "admin";
  if (isAdmin) {
    return await Order.find().populate("user", "name")
    .populate("books.book", "title")
    .exec();
  }
  return await Order.find({ user: user._id }).populate("user", "name")
  .populate("books.book", "title")
  .exec();
};
