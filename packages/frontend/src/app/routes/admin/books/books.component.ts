import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DomPortal, Portal } from  '@angular/cdk/portal'
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { BookValidator } from 'shared';
import { BookService } from '../../../services/book.service';
import { BehaviorSubject, debounceTime, map, of, Subject, tap } from 'rxjs';
import { z } from 'zod';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HeaderService } from '../../../services/header.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-books',
  imports: [CurrencyPipe, FormsModule, CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit, OnDestroy, AfterViewInit{
  private booksService = inject(BookService)
  private headerService = inject(HeaderService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  @ViewChild('headerPortal') portal!: TemplateRef<any>;
  
  search = new BehaviorSubject("")



  books: z.infer<typeof BookValidator>[] = []
  loading = false;
  error: Error | null = null;

  ngOnInit(): void {
      this.loadBooks()
      
      this.search.next(this.route.snapshot.queryParams["search"])

      this.search
      .pipe(debounceTime(1000))
      .subscribe(value=>{
        console.log({value});
        this.router.navigate([], {
          queryParamsHandling: "merge",
          queryParams: {
            search: value
          }
        })
      })
  }

  ngAfterViewInit(): void {
    this.headerService.setPortal(this.portal);
  }

  ngOnDestroy(): void {
      this.headerService.setPortal(null)
  }

  

  loadBooks(){
    this.loading = true
    this.booksService.getBooks(2)
      .subscribe({
        next: data=>{
          this.books=data
          this.loading = false
        },
        error: error=>{
          this.error = error
          this.loading = false
        },
      })
  }
  
 
  _util_ = {
    range: (length: number)=>Array.from({ length })
  }
}
