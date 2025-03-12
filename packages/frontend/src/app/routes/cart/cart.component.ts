import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { z } from 'zod';
import { CartPopulatedValidator, PaymentCreateResponse } from 'shared';
import { AsyncPipe, CurrencyPipe, DecimalPipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Types } from 'mongoose';
import { toast } from 'ngx-sonner';
import { CartService } from '../../services/cart.service';
import { catchError, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, AsyncPipe, JsonPipe, RouterLink, DecimalPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  host: {
    class: 'flex-1',
  },
})
export class CartComponent implements OnInit {
  protected readonly toast = toast;
  cart: z.infer<typeof CartPopulatedValidator> | null = null;
  error: string | null = null;

  loading = false

  selectedIds: string[] = [];

  totalAmount$: Observable<number>;

  constructor(public cartService: CartService, public http: HttpClient) {
    this.totalAmount$ = cartService.cart$.pipe(
      map((cart) => {
        return cart
          ? cart.books.reduce(
              (total, item) => total + item.quantity * item.book.price,
              0
            )
          : 0;
      })
    );
  }
  async ngOnInit() {
    this.cartService.fetchCart();
    this.cartService.error$.subscribe((error) => {
      if (error) {
        toast.error(error.error.message);
        this.error = error.error.message;
      }
    });
    this.cartService.cart$
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('hello'));
        })
      )
      .subscribe((value) => {
        this.cart = value;
        console.log(value);
      });
  }

  handleBookSelection(selected: string) {
    if (this.selectedIds.includes(selected))
      this.selectedIds = this.selectedIds.filter((id) => id !== selected);
    else this.selectedIds.push(selected);
  }

  increaseBookQuantity(id: string) {
    this.cartService.addBook(id);
  }

  async decreaseBookQuantity(id: string) {
    this.cartService.removeBook(id);
  }

  async startCheckout(){
    this.loading = true
    this.http.post<z.infer<typeof PaymentCreateResponse>>("/api/payment/create", null).subscribe({
      next: result=>{
        window.location.href = result.url
        
      }
    })
  }
}
