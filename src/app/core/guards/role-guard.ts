import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Auth } from '../services/auth';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    return auth.getUser().pipe(
      map((user) => {
        const role = user?.role;

        // NO USER
        if (!user) {
          return router.createUrlTree(['/login']);
        }

        // ROLE NO PERMITIDO
        if (!roles.includes(role)) {
          return router.createUrlTree(['/dashboard/user']);
        }

        return true;
      }),

      catchError(() => of(router.createUrlTree(['/login']))),
    );
  };
};
