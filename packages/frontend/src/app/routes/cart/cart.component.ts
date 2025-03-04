import { Component, OnInit } from '@angular/core';
import { z } from 'zod'
import { CartPopulatedValidator } from 'shared'
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: z.infer<typeof CartPopulatedValidator> | null = null;
  loading = true;
  error: string | null = null;
  ngOnInit(): void {
    fetch("/api/cart").then(c => c.json()).then(unsure=>CartPopulatedValidator.parse(unsure)).then(data=>{
      this.cart = data
    }).catch(error=>{
      this.error = error
    }).finally(()=>this.loading = false)
  }

  get totalAmount(){
    if(!this.cart)return 0
    return this.cart.books.reduce((total, item)=>total + (item.quantity * item.book.price), 0)

  }
}
