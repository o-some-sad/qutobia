import { Component, OnInit } from '@angular/core';
import { BookItem } from '../../interfaces/book.interface';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { JsonPipe, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-details',
  imports: [JsonPipe, NgClass],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  book: BookItem | null = null;


  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService
  )
  {
    console.log("hellllllllllllllloooooooooooooooooooo");
  }

  ngOnInit(): void {
    console.log("hellllllllllllllllllllllllllllllo");
    const bookId = this.route.snapshot.paramMap.get('id');
    console.log(bookId);
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe((res) => {
        this.book = res.data;
        console.log(this.book);
      });
    }
  }
  addToCart(book: string){
    console.log("Pressed: ", book);
    this.cartService.addBook(book);
  }
}
