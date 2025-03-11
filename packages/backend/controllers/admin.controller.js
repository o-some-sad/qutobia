import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Book from "../models/book.model.js";

export const getDashboardData = async () => {
  const totalUsers = await User.countDocuments();
  const totalBooks = await Book.countDocuments();
  const totalOrders = await Order.countDocuments();
  return [{
    type: 'users',
    count: totalUsers
  }, {
    type: 'books',
    count: totalBooks
  }, {
    type: 'orders',
    count: totalOrders,
  }];
};
