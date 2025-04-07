import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {inject} from '@angular/core';
import {catchError, map, of, switchMap} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map((response) => {
      console.log('AUTH RESPOONSE', response)
      return response.authenticated ? true : router.createUrlTree(['/login']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};

