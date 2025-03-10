import {Component, ViewChild} from '@angular/core';
import {BookItem} from '../../interfaces/book.interface';
import {BookDialogComponent} from '../../components/book-dialog/book-dialog.component';

@Component({
  selector: 'app-preview',
  imports: [
    BookDialogComponent
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent {

  book: BookItem = {
    _id: "67cda309ec11976a38fc41a4",
    title: "Divergent",
    author: [
      "Jana"
    ],
    price: 29.99,
    description: "description description",
    stock: 300,
    image: "https://res.cloudinary.com/duysjbyx1/image/upload/v1741529865/kotobia/books/eg5vhulhaimhx8axekaq.jpg",
    deletedAt: null
  }

  @ViewChild(BookDialogComponent) bookFormDialog!: BookDialogComponent;
  openBookForm(mode: 'add' | 'edit') {
    if (mode === 'edit') this.bookFormDialog.openModal(mode, this.book);
    else this.bookFormDialog.openModal(mode, null);
  }
}


