import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {adminGuard, notLoggedGuard, userOrAdminGuard} from './guards/based-role.guard';

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
        canActivate: [notLoggedGuard]
      },
      {
        path: 'order',
        loadComponent: () =>
          import('./routes/user-order/user-order.component').then(
            (c) => c.UserOrderComponent
          ),
        title: 'Orders',
        canActivate: [userOrAdminGuard]
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./routes/auth/register/register.component').then(
            (c) => c.RegisterComponent
          ),
        title: 'Register',
        canActivate: [notLoggedGuard]
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./routes/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
        title: 'Profile',
        canActivate: [userOrAdminGuard]
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./routes/cart/cart.component').then(
            (c) => c.CartComponent
          ),
        title: 'Cart',
        canActivate: [userOrAdminGuard]
      },
      // Add the book-details route here
      {
        path: 'book/:id',
        loadComponent: () =>
          import('./components/book-details/book-details.component').then(
            (c) => c.BookDetailsComponent
          ),
        title: 'Book Details',
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
    canActivate: [adminGuard]
  },
  { path: '**', component: NotFoundComponent, title: 'Not Found Page' },
];
