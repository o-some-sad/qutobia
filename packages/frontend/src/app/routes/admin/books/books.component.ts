import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { DomPortal, Portal } from  '@angular/cdk/portal'
import { ROUTER_OUTLET_DATA } from '@angular/router';
@Component({
  selector: 'app-books',
  imports: [],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent{
  routerData = inject(ROUTER_OUTLET_DATA)

 

}
