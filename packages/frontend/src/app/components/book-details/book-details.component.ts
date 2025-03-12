import { Component, OnInit } from '@angular/core';
import { BookItem } from '../../interfaces/book.interface';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { JsonPipe, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../interfaces/review.interface';
@Component({
  selector: 'app-book-details',
  imports: [JsonPipe, NgClass],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  book: BookItem | null = null;
  reviews: Review[] | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private reviewService: ReviewService
  )
  {}

  ngOnInit(): void {
    console.log("hellllllllllllllllllllllllllllllo");
    const bookId = this.route.snapshot.paramMap.get('id');
    console.log(bookId);
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe((res) => {
        this.book = res.data;
        console.log(this.book);
      });
      this.reviewService.getReviewsByBookId(bookId).subscribe(
        (reviews) => {
          this.reviews = reviews;
        },
        (error) => {
          console.error('Error fetching reviews:', error);
        }
      );
    }
  }

  addToCart(book: string){
    console.log("Pressed: ", book);
    this.cartService.addBook(book);
  }
}
