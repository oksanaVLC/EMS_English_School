import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const skipLoader =
    req.headers.has('X-Skip-Loading') ||
    req.url.includes('/favorite') ||
    req.url.includes('/like') ||
    req.url.includes('/toggle') ||
    req.url.includes('/status');

  if (!skipLoader) {
    loadingService.loadingOn();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoader) {
        loadingService.loadingOff();
      }
    }),
  );
};
