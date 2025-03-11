import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable, map } from 'rxjs';
import {BookItem, BookResponse, BooksResponse} from '../interfaces/book.interface';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }
  getBooks(page: number, limit: number, search: string): Observable<BooksResponse>{
    let url = `${environment.base_url}/books?page=${page}&limit=${limit}`;
    if(search) url+=`&title=${search}`; // to filter books according to the title the user inputs
    return this.http.get<BooksResponse>(url).pipe(map(res => ({
      totalPages: res.totalPages, data: res.data
    })));
  }
  addBook(formData: FormData): Observable<BookResponse> {
    return this.http.post<BookResponse>(`${environment.base_url}/books`, formData);
  }
  updateBook(book: BookItem): Observable<BookResponse> {
    return this.http.patch<BookResponse>(`${environment.base_url}/books/${book._id}`, book);
  }
  uploadImage(bookId: string, image: FormData): Observable<BookResponse> {
    return this.http.patch<BookResponse>(`${environment.base_url}/books/${bookId}/image`, image);
  }
  deleteBook(bookId: string): Observable<BookResponse> {
    return this.http.delete<BookResponse>(`${environment.base_url}/books/${bookId}`);
  }
}
// to extract data from the server-side
// observable --> returns an array of book objects
// pipe is used to get ONLY the objects inside the 'Books' array
