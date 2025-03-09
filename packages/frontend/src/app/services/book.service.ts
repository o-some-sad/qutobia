import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import { Observable, map, tap } from 'rxjs';
import { BookItem, BookResponse } from '../interfaces/book.interface';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }
  getBooks(page = 1, filter:  object = {}): Observable<BookItem[]>{
    return this.http.get<BookResponse>(`${environment.base_url}/books`, {
      params: {
        skip: (page - 1) * 10, limit: 10,
        ...filter
      }
    }).pipe(
      tap(console.log),
      map(res => res.Books));
  }
}
// to extract data from the server-side
// observable --> returns an array of book objects
// pipe is used to get ONLY the objects inside the 'Books' array