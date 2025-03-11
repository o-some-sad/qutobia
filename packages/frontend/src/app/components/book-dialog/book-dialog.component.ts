import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormArray, NonNullableFormBuilder
} from '@angular/forms';
import {toast} from 'ngx-sonner';
import {UserInputComponent} from '../user-input/user-input.component';
import {integerValidator, positiveNumberValidator} from '../../validations/integer.validator';
import {atLeastOneAuthorValidator} from '../../validations/at-least-one-author.validator';
import {BookItem} from '../../interfaces/book.interface';
import {BookService} from '../../services/book.service';
import {IconsModule} from '../../modules/icons/icons.module';

@Component({
  selector: 'app-book-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserInputComponent,
    IconsModule
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.css'
})
export class BookDialogComponent {
  isOpen = false;
  file!: File
  bookForm: FormGroup;
  book: BookItem | null = null;
  originalImage: string | null = null;
  @Input() mode: 'add' | 'edit' = 'add';
  selectedImage: string | ArrayBuffer | null = null;
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  maxFileSize = 1024 * 1024;
  @Output() bookAdded = new EventEmitter<void>();
  @Output() bookUpdated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private bookService: BookService) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, positiveNumberValidator]],
      stock: [0, [Validators.required, integerValidator, positiveNumberValidator]],
      author: this.fb.array([this.authorsFormGroup()], [Validators.required, atLeastOneAuthorValidator])
    });
  }
  authorsFormGroup(authorName: string = ''): FormGroup{
    return this.fb.group({
      author: [authorName, Validators.required],
    });
  }
  get bookFormControls():{ [key: string]: FormControl } {
    return this.bookForm.controls as { [key: string]: FormControl };
  }
  get authors(): FormArray {
    return this.bookForm.get('author') as FormArray;
  }
  addAuthor(authorName: string = ''){
    this.authors.push(this.authorsFormGroup(authorName));
  }
  removeAuthor(idx: number){
    this.authors.removeAt(idx);
  }

  toggleModal() {
    this.isOpen = !this.isOpen;
  }
  openModal(mode: 'add' | 'edit', book: BookItem | null) {
    this.mode = mode;
    this.book = book;
    this.isOpen = true;

    if(mode === 'edit' && book){
      this.bookForm.patchValue({
        title: book.title,
        description: book.description,
        price: book.price,
        stock: book.stock,
      });

      this.authors.clear();
      book.author.forEach(a => {
        this.addAuthor(a);
      });
    }
  }
  closeModal() {
    this.bookForm.reset();
    this.isOpen = false;
  }
  onSubmit() {
    if (this.bookForm.valid) {
      const authors = this.bookForm.get('author')?.value.map((author: { author: string }) => author.author);
      if(this.mode === 'add') {
        const toast_id = toast.loading('Adding Book...');

        this.bookService.addBook(this.makeFormData(this.file, authors)).subscribe({
          next: (res) => {
            toast.success('Book added successfully', { id: toast_id });
            this.closeModal();
            this.bookAdded.emit();
          },
          error: (_) => {
            toast.error('Failed to add book', { id: toast_id });
          },
        });
      } else if(this.mode === 'edit') {
        const toast_id = toast.loading('Updating Book...');
        this.bookService.updateBook({...this.bookForm.value, author: authors, _id: this.book!._id}).subscribe({
          next: (res) => {
            toast.success('Book updated successfully', { id: toast_id });
            this.closeModal();
            this.bookUpdated.emit();
          },
          error: (_) => {
            toast.error('Failed to update book', { id: toast_id });
          },
        });
      }
    } else {
      this.bookForm.markAllAsTouched();
    }
  }

  openFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];
      const fileExtension = this.file.name.split('.').pop()?.toLowerCase();
      if(!fileExtension || !this.allowedExtensions.includes(fileExtension)){
        toast.warning('Invalid file format. Please upload a JPG, PNG, or JPEG file.');
        return;
      }
      if(this.file.size>this.maxFileSize){
        toast.warning('File size should be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result || null;
      };
      reader.readAsDataURL(this.file);
      if(this.mode === 'edit') this.uploadImage(this.file);
    }
  }
  makeFormData(file: File, authors: string[]): FormData {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', this.bookForm.get('title')!.value);
    formData.append('description', this.bookForm.get('description')!.value);
    formData.append('price', this.bookForm.get('price')!.value);
    formData.append('stock', this.bookForm.get('stock')!.value);
    authors.forEach((author, index) => {
      formData.append(`author[${index}]`, author);
    });
    return formData;
  }
  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('image', file);
    const toast_id = toast.loading('Uploading image...');

    this.bookService.uploadImage(this.book!._id, formData).subscribe({
      next: (res) => {
        toast.success('Image uploaded successfully', { id: toast_id });
        this.book!.image = res.data.image;
        this.originalImage = res.data.image;
      },
      error: (_) => {
        toast.error('Failed to upload image', { id: toast_id });
        this.selectedImage = this.originalImage;
        this.book!.image = this.originalImage ?? '';
      },
    });
  }
}
