import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { NgxSonnerToaster } from 'ngx-sonner';
import { CartService } from './services/cart.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ThemingService } from './services/theming.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  themeing = inject(ThemingService)
  title = 'frontend';
}
