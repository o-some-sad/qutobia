import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { z } from 'zod';
import {
  ApiErrorValidator,
  CartPopulatedValidator,
  PaymentCreateResponse,
} from 'shared';
import {
  AsyncPipe,
  CurrencyPipe,
  DecimalPipe,
  JsonPipe,
} from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Types } from 'mongoose';
import { toast } from 'ngx-sonner';
import { CartService } from '../../services/cart.service';
import { catchError, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IconsModule } from '../../modules/icons/icons.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [
    CurrencyPipe,
    AsyncPipe,
    JsonPipe,
    RouterLink,
    DecimalPipe,
    IconsModule,
  ],
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

  loading = false;

  selectedIds: string[] = [];

  totalAmount$: Observable<number>;

  constructor(
    public cartService: CartService,
    public http: HttpClient,
    private _authService: AuthService,
    private router: Router
  ) {
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
    this.cartService.fetchCart().subscribe({
      //? why no next?
      //? we already waiting the values from cartService.cart$ below
      error: error=>{
        this.error = error.error.message
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
    const toastId = toast.loading("Adding book")
    this.cartService.addBook(id).subscribe({
      next:()=> {
          toast.success("Book added", { id: toastId })
          
      },
      error: error=>{
        toast.error(error.error.message, { id: toastId })
      }
    });
  }

  async decreaseBookQuantity(id: string) {
    const toastId = toast.loading("Removing book")
    this.cartService.removeBook(id).subscribe({
      next:()=> {
        toast.info("Book removed", { id: toastId })
        
    },
    error: error=>{
      toast.error(error.error.message, { id: toastId })
    }
    });
  }

  async startCheckout() {
    if (this._authService.user?.contact === null) {
      this.router
        .navigate(['/profile'], { queryParams: { preOrder: '' } })
        .then();
        return;
    }
    this.loading = true;
    this.http
      .post<z.infer<typeof PaymentCreateResponse>>('/api/payment/create', null)
      .subscribe({
        next: (result) => {
          window.location.href = result.url;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          try {
            const apiError = ApiErrorValidator.parse(error.error);
            toast.error(apiError.message, {});
            this.loading = false;
          } catch (error) {
            toast.error(`${error}`, {});
            this.loading = false;
          }
        },
      });
  }
}
