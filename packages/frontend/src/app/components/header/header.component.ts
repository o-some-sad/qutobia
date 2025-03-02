import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchValue = signal('')
  searchFocused = signal(false)
  searchResults = signal<string[]>([])

  constructor() {
    let ival: number | undefined = undefined;
    effect(() => {
      clearTimeout(ival)
      if (!this.searchFocused()) return;
      if (!this.searchValue()) {
        this.searchResults.set([])
        return
      }
      ival = setTimeout(() => {
        console.log(`The current count is: ${this.searchValue()}`);
        this.searchResults.set(Array.from({ length: 5 }).map(() => Math.random().toString()))
      }, 1000);
    });
  }
}
