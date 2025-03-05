import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {SearchService} from '../../services/search.service';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchValue: string = '';
  constructor(private searchService: SearchService) {}

  onSearchChange(): void {
    this.searchService.setSearchValue(this.searchValue);
  }
}
