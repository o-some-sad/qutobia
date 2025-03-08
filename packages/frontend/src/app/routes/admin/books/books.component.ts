import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomPortal, Portal } from  '@angular/cdk/portal'
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { BookValidator } from 'shared';
@Component({
  selector: 'app-books',
  imports: [],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit{
  
  ngOnInit(): void {
    fetch("/api/books?skip=0&limit=10").then(d=>d.json())
      .then(BookValidator.array().parse)
  }
  
 

}
