import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() BookItem : any;

  constructor(private cartService : CartService) {
    
  }

  addToCart(book: string){
    console.log("Pressed: ", book);
    this.cartService.addBook(book);
  }
}
