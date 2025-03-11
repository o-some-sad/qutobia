import {User} from './user.interface';

export interface BookItem {
  _id: string,
  title: string,
  author: string[],
  price: number,
  description: string,
  stock: number,
  image: string,
  deletedAt: Date | null
}

export interface BooksResponse {
  totalPages: number;
  data: BookItem[];
} // the array in the response has 'Books' before it --> Books : [ {}, {}, ...]

export interface BookResponse {
  data: BookItem;
}