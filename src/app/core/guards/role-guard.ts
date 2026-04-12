import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Auth } from '../services/auth';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    const cachedUser = auth.user();

    //  si ya tengo usuario en signal → sin HTTP
    if (cachedUser) {
      if (!roles.includes(cachedUser.role)) {
        return of(router.createUrlTree(['/dashboard/user']));
      }
      return of(true);
    }

    //  si no hay user → pedirlo al backend
    return auth.getUser().pipe(
      map((user) => {
        if (!user) return router.createUrlTree(['/login']);
        if (!roles.includes(user.role)) {
          return router.createUrlTree(['/dashboard/user']);
        }
        return true;
      }),
      catchError(() => of(router.createUrlTree(['/login']))),
    );
  };
};
