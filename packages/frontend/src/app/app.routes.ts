import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import { PreviewComponent } from './routes/preview/preview.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {UsersComponent} from './admin/users/users.component';
import {BooksComponent} from './admin/books/books.component';
import {OrdersComponent} from './admin/orders/orders.component';
import {HomePageComponent} from './home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: "Home Page" },
  { path: 'dashboard', component: DashboardComponent, title: "Dashboard" },
  { path: 'users', component: UsersComponent, title: "Users" },
  { path: 'books', component: BooksComponent, title: "Books" },
  { path: 'orders', component: OrdersComponent, title: "Orders" },
  { path: '**', component: NotFoundComponent, title: 'Not Found Page' },
];

if(isDevMode()){
    routes.push({
        path: 'preview',
        component: PreviewComponent
    })
}
