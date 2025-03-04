import { Component, OnInit } from '@angular/core';
import { z } from 'zod'
import { CartPopulatedValidator } from 'shared'
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Types } from 'mongoose';
import { toast } from 'ngx-sonner';


@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  protected readonly toast = toast
  cart: z.infer<typeof CartPopulatedValidator> | null = null;
  loading = true;
  error: string | null = null;
  async ngOnInit() {

    await this.fetchCart()



  }

  get totalAmount() {
    if (!this.cart) return 0
    return this.cart.books.reduce((total, item) => total + (item.quantity * item.book.price), 0)

  }


  async fetchCart() {
    const url = new URL("/api/cart", window.location.href)
    url.searchParams.append("pick", "title")
    url.searchParams.append("pick", "author")
    url.searchParams.append("pick", "price")
    url.searchParams.append("pick", "image")
    this.loading = true
    await fetch(url.toString()).then(c => c.json())
      // .then(unsure=>CartPopulatedValidator.parse(unsure))
      .then(data => {
        this.cart = data
      }).catch(error => {
        this.error = error
      }).finally(() => this.loading = false)
  }

  increaseBookQuantity(id: string | Types.ObjectId) {
    let statusToast = this.toast.loading("Please wait")
    this.loading = true
    fetch("/api/cart", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ book: id })
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        this.toast.error(error.message, {
          id: statusToast
        })
      } else {
        this.toast.success("Cart updated successfuly", {
          id: statusToast
        })
        await this.fetchCart()
      }

    })

      .catch(e => this.error = e).finally(() => this.loading = false)

  }
}
