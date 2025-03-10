import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DomPortal, Portal } from  '@angular/cdk/portal'
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { BookValidator } from 'shared';
import { BookService } from '../../../services/book.service';
import { BehaviorSubject, debounceTime, firstValueFrom, map, of, Subject, tap } from 'rxjs';
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
  currentPage = new BehaviorSubject(1);



  books: z.infer<typeof BookValidator>[] = []
  totalPages: number = 0;
  loading = false;
  error: Error | null = null;

  ngOnInit(): void {
      this.loading = true      
      this.search.next(this.route.snapshot.queryParams["search"])

      this.currentPage.subscribe(async page=>{
        console.log({page});
        
        this.router.navigate([], {
          queryParamsHandling: "merge",
          queryParams: {
            page: page,
          }
        })
      })

      this.search
      .pipe(debounceTime(1000))
      .subscribe(async value=>{
        this.currentPage.next(1)
        this.router.navigate([], {
          queryParamsHandling: "merge",
          queryParams: {
            search: value
          }
        })
        await this.loadBooks()
      })
  }

  ngAfterViewInit(): void {
    this.headerService.setPortal(this.portal);
  }

  ngOnDestroy(): void {
      this.headerService.setPortal(null)
  }

  

  async loadBooks(){
    this.loading = true
    this.booksService.getBooks(await firstValueFrom(this.currentPage), 10, await firstValueFrom(this.search))
      .subscribe({
        next: result=>{
          this.totalPages = result.totalPages          
          this.books=result.data
          this.loading = false
        },
        error: error=>{
          this.error = error
          this.loading = false
        },
      })
  }
  
 
  _util_ = {
    range: (length: number)=>Array.from({ length }, (_, i)=>i)
  }
}
