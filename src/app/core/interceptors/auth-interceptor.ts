import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonar la petición con withCredentials
  const clonedRequest = req.clone({
    withCredentials: true,
    headers: req.headers.set('X-Requested-With', 'XMLHttpRequest'),
  });

  console.log('Interceptor - URL:', clonedRequest.url);
  console.log('Interceptor - withCredentials:', clonedRequest.withCredentials);

  return next(clonedRequest);
};
