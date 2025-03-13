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
import { toast } from 'ngx-sonner';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-book-details',
  imports: [NgClass, FormsModule,],
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
    private orderService: OrdersService,
    private cdr: ChangeDetectorRef
  )
  {}

  async ngOnInit(){
    this.newReview.user = await firstValueFrom(this.authService.me());
    console.log(this.newReview.user);
    if(this.newReview.user.role === "admin"){
      this.isAdmin = true;
    }
    else{
      this.isAdmin = false;
    }


    const bookId = this.route.snapshot.paramMap.get('id');
    console.log(bookId);
    
    if (bookId) {
        this.bookService.getBookById(bookId).subscribe((res) => {
        this.book = res.data;
        this.newReview.book = this.book;
        console.log(this.book);
      });

      

      this.orderService.getUserOrder(this.newReview.user._id).subscribe((orders) => {
        this.hasCompletedOrder = false; // Initialize to false
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!", orders);

        //@ts-ignore
        orders.order.forEach((ord) => {
          if (ord.status === "Completed") {
            console.log("????????????????????????????????????",ord);
            ord.books.forEach((item: { book: {_id:string} }) => { // Explicitly type `book`
              console.log(item);
              if (item.book._id === bookId) {
                this.hasCompletedOrder = true; // Set to true if the book is found
              }
            });
          }
        });
      
        console.log('User has completed order:', this.hasCompletedOrder);
      });

   this.fetchReviews(bookId);
    }
  }

   // Fetch reviews for a book
   fetchReviews(bookId: string): void {
    this.reviewService.getReviewsByBookId(bookId).subscribe(
      (reviews) => {
        this.reviews = reviews;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

     // Add a new review
  addReview(): void {
    if (!this.newReview.review || !this.newReview.rating) {
      toast.error("please fill out the fields");
      return;
    }
    console.log('Adding review:', this.newReview);

    this.reviewService.addReview(this.newReview.user._id, this.newReview.book._id, this.newReview).subscribe(
      (review) => {
        this.reviews.push(review); // Add the new review to the list
        this.newReview = { user: {} as User, book: this.newReview.book, rating: 1, review: '' }; // Reset the form
        this.fetchReviews(this.newReview.book._id);
        toast.success('review added successfully');
        window.location.reload();
      },
      (error) => {
        toast.error("review couldn't be added");
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
      console.log(this.editingReview);
      const toast_id = toast.loading('Editing Review...');
      this.reviewService.updateReview(this.editingReview._id, this.editingReview).subscribe(
        (updatedReview) => {
          const index = this.reviews.findIndex((r) => r._id === updatedReview._id);
          if (index !== -1) {
            this.reviews[index] = updatedReview; // Update the review in the list
          }
          if(this.editingReview?.book._id){
            this.fetchReviews(this.editingReview.book._id);
            this.editingReview = null; // Stop editing
            toast.success('Updated Successfully', { id: toast_id });
          }
        },
        (error) => {
          toast.error("failed to update the review", { id: toast_id });
        }
      );
    }

      // Delete a review
      deleteReview(reviewId: string): void {
        toast.warning("Are you sure you want to delete this review?", {
          action: {
            label: "yes",
            onClick:() => {
              try{
                this.reviewService.deleteReview(reviewId).subscribe(
                  () => {
                    this.reviews = this.reviews.filter((r) => r._id !== reviewId); 
                    toast.success("review deleted successfuly");
                  })
              }
              catch(err){
                toast.error("cannot be deleted");
              }
            }
          },
          cancel: {
            label: "no",
            onClick:() => {
            }
          }
        });

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
