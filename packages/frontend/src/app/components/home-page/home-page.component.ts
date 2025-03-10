import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookItem } from '../../interfaces/book.interface';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'app-home-page',
  imports: [BookCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  books : BookItem[] = [];
  constructor(private bookService : BookService){

  } // injecting the book service

  ngOnInit(): void { // so it's the 1st things that's displayed when the website is opened
      this.bookService.getBooks().subscribe(res => {
        this.books = res; // populate books array with API response , got all book objects
      })
  }
}
