import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../interfaces/review.interface';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.base_url}`;

  constructor(private http: HttpClient) {}
 // Get all reviews for a book by book ID
 getReviewsByBookId(bookId: string): Observable<Review[]> {
  return this.http.get<Review[]>(`${this.apiUrl}/${bookId}`);
}

// Add a new review
addReview(userId: string, bookId: string, reviewData: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>): Observable<Review> {
  return this.http.post<Review>(`${this.apiUrl}`, { userId, bookId, ...reviewData });
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
