import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookItem } from '../../interfaces/book.interface';
import { BookCardComponent } from '../book-card/book-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [BookCardComponent, PaginationComponent, FormsModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  books : BookItem[] = [];
  currPage: number = 1;
  totalPages: number = 1;
  searchedTitle: string = "";
  selectedAuthor: string = ""; // DEFAULT VALUE
  authors : string[] = [];
  minPrice : number = 0;
  maxPrice : number = 0;
  constructor(private bookService : BookService){} // injecting the book service

  ngOnInit(): void {
    this.loadBooks(this.currPage);
    this.bookService.bookFilter().subscribe(res => {
      this.authors = res.author;
      this.minPrice = res.price[0];
      this.maxPrice = res.price[1];
    })
  }
  goToPage(page: number) {
    this.currPage = page;
    this.loadBooks(page);
  }
  loadBooks(page: number){
    this.bookService.getBooks(page, 12, this.searchedTitle, this.selectedAuthor, this.minPrice, this.maxPrice).subscribe(res => {
      this.books = res.data; // populate books array with API response , got all book objects
      this.totalPages = res.totalPages; // totalPages from the server-side
    })
  }

  filterByAuthor() {
    this.loadBooks(1);
  }

  resetAuthor(){
    this.selectedAuthor = "";
    this.loadBooks(1);
  }

  removePopUp(e: Event) {
    (e.currentTarget as HTMLElement).blur();
  }
  // currentTarget is the button pressed, and blur() removes focus of it
  // (as HTMLElement is used for casting makes sure that the currentTarget is an htmlElement)
}
