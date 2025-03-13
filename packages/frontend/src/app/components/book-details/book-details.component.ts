import { Component, NgModule, OnInit } from '@angular/core';
import { BookItem } from '../../interfaces/book.interface';
import { User } from '../../interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { JsonPipe, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ReviewService } from '../../services/review.service';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../interfaces/review.interface';
import { FormsModule, NgModel } from '@angular/forms';
@Component({
  selector: 'app-book-details',
  imports: [JsonPipe, NgClass, FormsModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  book: BookItem | null = null;
  reviews: Review[] = [];
  newReview: Omit<Review, '_id' | 'createdAt' | 'updatedAt'> = {
    user: {} as User, // Will be populated with the logged-in user's ID
    book: {} as BookItem, // Will be populated with the book ID
    rating: 1,
    review: '',
  };
  editingReview: Review | null = null; // Track the review being edited
  showAddReviewForm: boolean = false; // Controls visibility of the "Add Review" form
  hasCompletedOrder: boolean = false; // Track if the user has a completed order
  isAdmin: boolean = false; // Track if the user is an admin

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private orderService: OrdersService
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
   this.fetchReviews(bookId);
    }
  }

   // Fetch reviews for a book
   fetchReviews(bookId: string): void {
    this.reviewService.getReviewsByBookId(bookId).subscribe(
      (reviews) => {
        this.reviews = reviews;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

     // Add a new review
  addReview(): void {
    if (!this.newReview.review || !this.newReview.rating) {
      alert('Please fill out all fields.');
      return;
    }

    this.reviewService.addReview(this.newReview.user._id, this.newReview.book._id, this.newReview).subscribe(
      (review) => {
        this.reviews.push(review); // Add the new review to the list
        this.newReview = { user: {} as User, book: this.newReview.book, rating: 1, review: '' }; // Reset the form
      },
      (error) => {
        console.error('Error adding review:', error);
      }
    );
  }

    // Start editing a review
    startEditReview(review: Review): void {
      this.editingReview = { ...review }; // Create a copy of the review to edit
    }

    updateReview(): void {
      if (!this.editingReview) return;

      this.reviewService.updateReview(this.editingReview._id, this.editingReview).subscribe(
        (updatedReview) => {
          const index = this.reviews.findIndex((r) => r._id === updatedReview._id);
          if (index !== -1) {
            this.reviews[index] = updatedReview; // Update the review in the list
          }
          this.editingReview = null; // Stop editing
        },
        (error) => {
          console.error('Error updating review:', error);
        }
      );
    }

      // Delete a review
      deleteReview(reviewId: string): void {
        if (confirm('Are you sure you want to delete this review?')) {
          this.reviewService.deleteReview(reviewId).subscribe(
            () => {
              this.reviews = this.reviews.filter((r) => r._id !== reviewId); // Remove the review from the list
            },
            (error) => {
              console.error('Error deleting review:', error);
            }
          );
        }
      }

  addToCart(book: string){
    console.log("Pressed: ", book);
    this.cartService.addBook(book);
  }
}
