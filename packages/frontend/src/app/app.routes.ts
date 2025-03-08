import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import { PreviewComponent } from './routes/preview/preview.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CheckoutComponent } from './routes/checkout/checkout.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import("./home-page/home-page.component").then(c => c.HomePageComponent), title: "Home Page" },
  { path: 'login', loadComponent: ()=>import("./routes/auth/login/login.component").then(c=>c.LoginComponent), title: "Log In" },
  { path: 'profile', loadComponent: () => import("./routes/profile/profile.component").then(c => c.ProfileComponent), title: "Profile" },
  { path: 'register', loadComponent: () => import("./routes/auth/register/register.component").then(c => c.RegisterComponent), title: "Register" },
  {
    path: 'dashboard',
    loadComponent: () => import("./routes/admin/dashboard/dashboard.component").then(c => c.DashboardComponent),
    title: "Dashboard",
    children: [
      {
        path: "",
        loadComponent: () => import("./routes/admin/stats/stats.component").then(c => c.StatsComponent),
        title: "Dashboard - Stats"
      },
      {
        path: 'books',
        loadComponent: () => import("./routes/admin/books/books.component").then(c => c.BooksComponent), title: "Books"
      }]
  },
  {
    path: 'dashboard/users', loadComponent: () => import("./routes/admin/users/users.component").then(c => c.UsersComponent), title: "Users"
  },
  { path: 'dashboard/orders', loadComponent: () => import("./routes/admin/orders/orders.component").then(c => c.OrdersComponent), title: "Orders" },
  { path: 'cart', loadComponent: () => import("./routes/cart/cart.component").then(c => c.CartComponent), title: "Cart" },
  {
    path: "checkout", component: CheckoutComponent
  },
  // { path: '**', component: NotFoundComponent, title: 'Not Found Page' },
];

if (isDevMode()) {
  routes.push({
    path: 'preview',
    component: PreviewComponent
  })
}
