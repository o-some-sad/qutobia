import { User } from "./user.interface";
import { BookItem } from "./book.interface";

export interface Review {
  _id: string,
  user: User,
  book: BookItem,
  rating: Number,
  review: string,
  createdAt?: string; // "?" cuz optional
  updatedAt?: string;
}

