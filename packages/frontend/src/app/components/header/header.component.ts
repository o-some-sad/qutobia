import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {SearchComponent} from '../search/search.component';
import {AuthService} from '../../services/auth.service';
import {User} from '../../interfaces/user.interface';
import {SharedService} from '../../services/shared.service';
import { IconsModule } from '../../modules/icons/icons.module';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';


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
  cartQuantity = 0;
  cartAmout = 0;

  constructor(private authService: AuthService, private sharedService: SharedService, private cartService: CartService){
    this.applyTheme()    
    this.cartService.cart$.subscribe(cart=>{
      if(!cart)return
      this.cartQuantity = cart.books.reduce((total, item)=>item.quantity + total, 0)
      this.cartAmout = cart.books.reduce((total, item)=>(item.quantity*item.book.price)+total, 0)
    })
  }
  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (res) => {
        this.user = res;
        this.cartService.fetchCart()
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
  constructor(private _AuthService:AuthService,private _Router:Router){
    this.applyTheme()
  }
  logOut(){
    this._AuthService.logout().subscribe({
    error:(err)=>console.error(err),
    complete:()=>this._Router.navigate(['/login'])
    
    })
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
