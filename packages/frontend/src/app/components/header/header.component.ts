import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {SearchComponent} from '../search/search.component';
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
export class HeaderComponent {
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
