import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { toast } from 'ngx-sonner';
// import { RouterLink } from '@angular/router';

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
    const toastId = toast.loading("Adding book")
    this.cartService.addBook(book).subscribe({
      next:()=> {
          toast.success("Book added", { id: toastId })
          
      },
      error: error=>{
        toast.error(error.error.message, { id: toastId })
      }
    });
  }
}
