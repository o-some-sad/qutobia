import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../interfaces/review.interface';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.base_url}/reviews`;

  constructor(private http: HttpClient) {}
 // Get all reviews for a book by book ID
 getReviewsByBookId(bookId: string): Observable<Review[]> {
  return this.http.get<Review[]>(`${this.apiUrl}/${bookId}`);
}

// Add a new review
addReview(userId: string, bookId: string, reviewData: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>): Observable<Review> {
  const body = {
    user: userId,    // Send as "user"
    book: bookId,    // Send as "book"
    rating: reviewData.rating,
    review: reviewData.review
  };
  return this.http.post<Review>(`${this.apiUrl}`, body);
}

// Update a review
updateReview(reviewId: string, updatedFields: Partial<Review>): Observable<Review> {
  return this.http.patch<Review>(`${this.apiUrl}/${reviewId}`, updatedFields);
}

// Delete a review (admin only)
deleteReview(reviewId: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
}
}
