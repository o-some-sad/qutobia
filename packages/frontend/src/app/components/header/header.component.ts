import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {SearchComponent} from '../search/search.component';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  onSearchChange(search: string) {}
}
