import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BookValidator } from 'shared';
import { BookService } from '../../../services/book.service';
import {
  BehaviorSubject,
  debounceTime,
  firstValueFrom,
} from 'rxjs';
import { z } from 'zod';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HeaderService } from '../../../services/header.service';
import { FormsModule } from '@angular/forms';
import { BookDialogComponent } from '../../../components/book-dialog/book-dialog.component';
import { BookItem } from '../../../interfaces/book.interface';
import { toast } from 'ngx-sonner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-books',
  imports: [
    CurrencyPipe,
    FormsModule,
    CommonModule,
    FormsModule,
    BookDialogComponent,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit, OnDestroy, AfterViewInit {
  private booksService = inject(BookService);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('headerPortal') portal!: TemplateRef<any>;
  @ViewChild(BookDialogComponent) bookFormDialog!: BookDialogComponent;
  openBookForm(mode: 'add' | 'edit', book: BookItem | null = null) {
    if (mode === 'edit') this.bookFormDialog.openModal(mode, book);
    else this.bookFormDialog.openModal(mode, null);
  }

  search = new BehaviorSubject('');
  currentPage = new BehaviorSubject(1);

  books: z.infer<typeof BookValidator>[] = [];
  totalPages: number = 0;
  loading = false;
  error: Error | null = null;

  onBookAdded(): void {
    this.currentPage.next(1);
    this.loadBooks();
  }
  onBookUpdated(): void {
    this.loadBooks();
  }  
  ngAfterViewInit(): void {
    this.headerService.setPortal(this.portal);
  }
  ngOnDestroy(): void {
    this.headerService.setPortal(null);
  }

  ngOnInit(): void {
    this.loading = true;
    this.search.next(this.route.snapshot.queryParams['search']);

    this.currentPage.subscribe(async (page) => {
      console.log({ page });

      this.router.navigate([], {
        queryParamsHandling: 'merge',
        queryParams: {
          page: page,
        },
      });
    });

    this.search.pipe(debounceTime(1000)).subscribe(async (value) => {
      this.currentPage.next(1);
      this.router.navigate([], {
        queryParamsHandling: 'merge',
        queryParams: {
          search: value,
        },
      });
      await this.loadBooks();
    });
  }

  async loadBooks() {
    this.loading = true;
    this.booksService
      .getBooks(
        await firstValueFrom(this.currentPage),
        10,
        await firstValueFrom(this.search)
      )
      .subscribe({
        next: (result) => {
          this.totalPages = result.totalPages;
          this.books = result.data;
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }

  deleteBook(bookId: string){
    const toast_id = toast.loading('Deleting book...');
    this.booksService.deleteBook(bookId).subscribe({
      next: (res) => {
        toast.success('Book deleted successfully', { id: toast_id });
        this.loadBooks();
      },
      error: (_) => {
        toast.error('Failed to delete book', { id: toast_id });
      },
    })
  }

  _util_ = {
    range: (length: number) => Array.from({ length }, (_, i) => i),
  };
}
