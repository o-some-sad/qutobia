import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { NgxSonnerToaster } from 'ngx-sonner';
import { CartService } from './services/cart.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {ToastComponent} from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
