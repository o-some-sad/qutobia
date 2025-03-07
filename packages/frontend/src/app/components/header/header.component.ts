import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {SearchComponent} from '../search/search.component';
import {AuthService} from '../../services/auth.service';
import {User} from '../../interfaces/user.interface';
import {SharedService} from '../../services/shared.service';
import {initializeAutocomplete} from '@angular/cli/src/utilities/completion';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  constructor(private authService: AuthService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (_) => {
        this.user = null;
      }
    });
    this.sharedService.userImage$.subscribe(imageUrl=>{
      if(this.user && imageUrl) this.user.image = imageUrl;
    });
  }
  onSearchChange(search: string) {}
}
