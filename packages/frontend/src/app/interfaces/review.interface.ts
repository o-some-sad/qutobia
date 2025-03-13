import { User } from "./user.interface";
import { BookItem } from "./book.interface";

export interface Review {
  _id: string,
  user: User, //User or String?
  book: BookItem, //BookItem or String?
  rating: Number,
  review: string,
  createdAt?: string; // "?" cuz optional
  updatedAt?: string;
}

