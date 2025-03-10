import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDialogComponent } from './book-dialog.component';

describe('BookDialogComponent', () => {
  let component: BookDialogComponent;
  let fixture: ComponentFixture<BookDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
