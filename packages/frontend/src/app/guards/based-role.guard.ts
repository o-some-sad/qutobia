import {map} from 'rxjs';
import {inject} from '@angular/core';
import {Location} from '@angular/common';
import {AuthService} from '../services/auth.service';
import {CanActivateFn, Router} from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.userRole().pipe(map(role => {
    if (role === 'admin') return true;
    else {
      router.navigate(['/']).then();
      return false;
    }
  }));
};

export const userOrAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.userRole().pipe(map(role => {
    if (role === 'user' || role === 'admin') return true;
    else {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } }).then();
      return false;
    }
  }));
};

export const notLoggedGuard: CanActivateFn = (route, state) => {
  const location = inject(Location);
  const authService = inject(AuthService);

  return authService.userRole().pipe(map(role => {
    if (role === 'user' || role === 'admin') {
      location.back();
      return false;
    } else {
      return true;
    }
  }));
};

// export const userGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const authService = inject(AuthService);
//
//   return authService.userRole().pipe(map(role => {
//     if (role === 'user') return true;
//     else if (role === 'admin') {
//       router.navigate(['/dashboard']).then();
//       return false;
//     } else {
//       router.navigate(['/']).then();
//       return false;
//     }
//   }));
// };
