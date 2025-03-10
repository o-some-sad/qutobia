import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { BookItem, BookResponse } from '../interfaces/book.interface';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }
  getBooks(): Observable<BookItem[]>{
    return this.http.get<BookResponse>(`${environment.base_url}/books`).pipe(map(res => res.Books));
  }
}
// to extract data from the server-side
// observable --> returns an array of book objects
// pipe is used to get ONLY the objects inside the 'Books' array