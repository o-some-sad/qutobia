import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { SharedService } from '../../services/shared.service';
import { IconsModule } from '../../modules/icons/icons.module';
import { CartService } from '../../services/cart.service';
import { ThemingService } from '../../services/theming.service';
import { DecimalPipe } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink, IconsModule, DecimalPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  themingService = inject(ThemingService)

  user: User | null = null;
  cartQuantity = 0;
  cartAmout = 0;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private cartService: CartService,
    private _Router: Router
  ) {
    this.cartService.cart$.subscribe((cart) => {
      if (!cart) return;
      this.cartQuantity = cart.books.reduce(
        (total, item) => item.quantity + total,
        0
      );
      this.cartAmout = cart.books.reduce(
        (total, item) => item.quantity * item.book.price + total,
        0
      );
    });
  }
  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (res) => {
        this.user = res;
        this.cartService.fetchCart().subscribe();
      },
      error: (_) => {
        this.user = null;
      },
    });
    this.sharedService.userImage$.subscribe((imageUrl) => {
      if (this.user && imageUrl) this.user.image = imageUrl;
    });
    this.sharedService.userLogged$.subscribe((user)=> {
      this.user = user;
    });
  }
  onSearchChange(search: string) {}

  logOut() {
    this.user = null;
    this.authService.logout().subscribe({
      error: (err) => console.error(err),
      complete: () => {
        toast.success("Logged out successfully, redirecting...")
        setTimeout(() => {
          window.location.replace("/")
        }, 1000);
      }
    });
  }
}
