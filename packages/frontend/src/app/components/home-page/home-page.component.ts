import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookItem } from '../../interfaces/book.interface';
import { BookCardComponent } from '../book-card/book-card.component';
import { PaginationComponent } from '../pagination/pagination.component';


@Component({
  selector: 'app-home-page',
  imports: [BookCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  books : BookItem[] = [];
  currPage: number = 1;
  totalPages: number = 1;
  constructor(private bookService : BookService){} // injecting the book service

  ngOnInit(): void {
    this.loadBooks(this.currPage);
  }
  goToPage(page: number) {
    this.currPage = page;
    this.loadBooks(page);
  }
  loadBooks(page: number){
    this.bookService.getBooks(page,12,"").subscribe(res => {
      this.books = res.data; // populate books array with API response , got all book objects
      this.totalPages = res.totalPages; // totalPages from the server-side
    })
  }
}
