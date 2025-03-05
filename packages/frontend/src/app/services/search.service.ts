import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchValueSubject = new BehaviorSubject<string>('');
  searchValue$ = this.searchValueSubject.asObservable();

  constructor() { }
  setSearchValue(value: string): void {
    this.searchValueSubject.next(value);
  }
}
