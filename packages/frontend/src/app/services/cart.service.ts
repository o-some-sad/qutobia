import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import { BehaviorSubject, catchError, firstValueFrom, map, throwError } from 'rxjs';
import { CartPopulatedValidator, ApiErrorValidator } from 'shared'

import { z } from 'zod';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient)
  cart$ = new BehaviorSubject<z.infer<typeof CartPopulatedValidator> | null>(null);
  loading = signal(false);
  error$ = new BehaviorSubject<HttpErrorResponse | null>(null)


  async fetchCart() {
    this.loading.set(true)
    const observable = this.http.get("/api/cart")
      .pipe(map(unsafe => CartPopulatedValidator.parse(unsafe)))
      .pipe(catchError(this.errorHandler.bind(this)))
    observable.subscribe(value => {
      this.cart$.next(value)
      this.loading.set(false)
    })
    return firstValueFrom(observable)
  }

  addBook(book: string) {
    const statusToast = toast.loading("please wait")
    this.loading.set(true)
    this.http.post("/api/cart", {
      book
    })
      .pipe(catchError(this.errorHandler.bind(this)))
      .pipe(catchError(error => {
        this.loading.set(false)
        toast.error(error.message, {
          id: statusToast
        })
        return throwError(() => error)
      }))
      .subscribe(() => {
        this.fetchCart().then(() => {
          this.loading.set(false)
          toast.success("Book added successfully", {
            id: statusToast
          })
        })

      })
  }

  removeBook(book: string) {
    const statusToast = toast.loading("please wait")
    this.loading.set(true)
    this.http.delete(`/api/cart/${book}`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .pipe(catchError(error => {
        this.loading.set(false)
        toast.error(error.message, {
          id: statusToast
        })
        return throwError(() => error)
      }))
      .subscribe(() => {
        this.fetchCart().then(() => {
          this.loading.set(false)
          toast.info("Book removed", {
            id: statusToast
          })
        })

      })
  }




  errorHandler(error: HttpErrorResponse) {    
    const formattedError = ApiErrorValidator.safeParse(error.error)
    this.loading.set(false)
    if (formattedError.success) {
      this.error$.next(error)
      return throwError(() => new Error(formattedError.data.message))
    }
    return throwError(() => error)

  }
}
