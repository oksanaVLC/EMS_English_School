import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Auth } from '../services/auth';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    const cachedUser = auth.user();

    // ✅ 1. Si ya hay user en memoria → NO HTTP
    if (cachedUser) {
      if (!roles.includes(cachedUser.role)) {
        return of(router.createUrlTree(['/user']));
      }
      return of(true);
    }

    // ✅ 2. Si NO hay user → llamar backend
    return auth.loadUser().pipe(
      map((user: any) => {
        if (!user) return router.createUrlTree(['/login']);

        if (!roles.includes(user.role)) {
          return router.createUrlTree(['/user']);
        }

        return true;
      }),
      catchError(() => of(router.createUrlTree(['/login']))),
    );
  };
};
