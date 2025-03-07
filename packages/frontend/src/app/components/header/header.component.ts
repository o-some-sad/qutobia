import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {SearchComponent} from '../search/search.component';
import {AuthService} from '../../services/auth.service';
import {User} from '../../interfaces/user.interface';
import {SharedService} from '../../services/shared.service';
import { IconsModule } from '../../modules/icons/icons.module';

const THEMES = {
  system: null,
  dark: 'dracula',
  light: 'lofi'
}


@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink, SearchComponent, IconsModule],
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

  currentTheme!: keyof typeof THEMES;
  constructor(){
    this.applyTheme()    
  }



  setTheme(theme: keyof typeof THEMES){
    window.localStorage.setItem("theme", theme)
    this.applyTheme()
  }
  
  

  private applyTheme(){
    let currentTheme = localStorage.getItem("theme") || "system"
    if(!(currentTheme in THEMES))currentTheme = "system";
    this.currentTheme = currentTheme as keyof typeof THEMES;
    if(THEMES[currentTheme as keyof typeof THEMES])document.documentElement.setAttribute("data-theme", THEMES[currentTheme as keyof typeof THEMES]!)
    else document.documentElement.removeAttribute("data-theme")
  }
}
