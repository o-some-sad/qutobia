import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import { PreviewComponent } from './routes/preview/preview.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', loadComponent: ()=>import("./home-page/home-page.component").then(c=>c.HomePageComponent), title: "Home Page" },
  { path: 'login', loadComponent: ()=>import("./components/login/login.component").then(c=>c.LoginComponent), title: "Log In" },
  { path: 'profile', loadComponent: ()=>import("./routes/profile/profile.component").then(c=>c.ProfileComponent), title: "Profile" },
  { path: 'dashboard', loadComponent: ()=>import("./routes/admin/dashboard/dashboard.component").then(c=>c.DashboardComponent), title: "Dashboard" },
  { path: 'dashboard/users', loadComponent: ()=>import("./routes/admin/users/users.component").then(c=>c.UsersComponent), title: "Users" },
  { path: 'dashboard/books', loadComponent: ()=>import("./routes/admin/books/books.component").then(c=>c.BooksComponent), title: "Books" },
  { path: 'dashboard/orders', loadComponent: ()=>import("./routes/admin/orders/orders.component").then(c=>c.OrdersComponent), title: "Orders" },
  { path: 'cart', loadComponent: ()=>import("./routes/cart/cart.component").then(c=>c.CartComponent), title: "Cart"},
  // { path: '**', component: NotFoundComponent, title: 'Not Found Page' },
];

if (isDevMode()) {
  routes.push({
    path: 'preview',
    component: PreviewComponent
  })
}
