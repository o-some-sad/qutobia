import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import { PreviewComponent } from './routes/preview/preview.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home-page/home-page.component').then(
            (c) => c.HomePageComponent
          ),
        title: 'Home Page',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./routes/auth/login/login.component').then(
            (c) => c.LoginComponent
          ),
        title: 'Log In',
      },
      {
        path: 'order',
        loadComponent: () =>
          import('./routes/user-order/user-order.component').then(
            (c) => c.UserOrderComponent
          ),
        title: 'Orders',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./routes/auth/register/register.component').then(
            (c) => c.RegisterComponent
          ),
        title: 'Register',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./routes/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
        title: 'Profile',
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./routes/cart/cart.component').then((c) => c.CartComponent),
        title: 'Cart',
      },
    ],
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./routes/admin/stats/stats.component').then(
            (c) => c.StatsComponent
          ),
        title: 'Dashboard - Stats',
      },
      {
        path: 'books',
        loadComponent: () =>
          import('./routes/admin/books/books.component').then(
            (c) => c.BooksComponent
          ),
        title: 'Books',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./routes/admin/users/users.component').then(
            (c) => c.UsersComponent
          ),
        title: 'Users',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./routes/admin/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
        title: 'Orders',
      },
    ],
  },
  { path: '**', component: NotFoundComponent, title: 'Not Found Page' },
];