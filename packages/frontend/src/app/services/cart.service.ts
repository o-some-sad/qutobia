import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import {
  BehaviorSubject,
  catchError,
  first,
  firstValueFrom,
  map,
  tap,
  throwError,
} from 'rxjs';
import { CartPopulatedValidator, ApiErrorValidator } from 'shared';

import { z } from 'zod';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  cart$ = new BehaviorSubject<z.infer<typeof CartPopulatedValidator> | null>(
    null
  );
  loading = signal(false);

  fetchCart() {
    this.loading.set(true);
    return this.http
      .get('/api/cart')
      .pipe(map((unsafe) => CartPopulatedValidator.parse(unsafe)))
      .pipe(
        tap((value) => {
          this.cart$.next(value);
          this.loading.set(false);
        }),
        catchError((error) => {
          this.loading.set(false)
          return throwError(() => error);
        })
      );
  }

  addBook(book: string) {
    this.loading.set(true);
    return this.http
      .post('/api/cart', {
        book,
      })
      .pipe(map(() => this.fetchCart().subscribe()))
  }

  removeBook(book: string) {
    this.loading.set(true);
    return this.http
      .delete(`/api/cart/${book}`)
      .pipe(map(() => this.fetchCart().subscribe()))
  }

  // removeBook(book: string) {
  //   const statusToast = toast.loading('please wait');
  //   this.loading.set(true);
  //   return this.http
  //     .delete(`/api/cart/${book}`)
  //     .pipe(
  //       catchError((error) => {
  //         this.loading.set(false);
  //         toast.error(error.message, {
  //           id: statusToast,
  //         });
  //         return throwError(() => error);
  //       })
  //     )
  //     .subscribe(() => {
  //       this.fetchCart().then(() => {
  //         this.loading.set(false);
  //         toast.info('Book removed', {
  //           id: statusToast,
  //         });
  //       });
  //     });
  // }
}
