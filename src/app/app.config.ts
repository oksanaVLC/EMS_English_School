import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';

import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { ScrollService } from './core/services/scroll';

// Inicialización del servicio
function initializeScrollService() {
  return () => {
    const scrollService = inject(ScrollService);

    // Activar smooth scroll al inicio
    scrollService.enableSmoothScroll();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor, loadingInterceptor])),

    provideAnimations(),

    // Inicializador correcto
    {
      provide: APP_INITIALIZER,
      useFactory: initializeScrollService,
      multi: true,
    },
  ],
};
