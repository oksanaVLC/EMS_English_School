import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    const isLogged = auth.isLoggedIn();
    const role = auth.getRole();

    if (!isLogged) {
      return router.createUrlTree(['/login']);
    }

    if (!roles.includes(role!)) {
      return router.createUrlTree(['/dashboard']);
    }

    return true;
  };
};
