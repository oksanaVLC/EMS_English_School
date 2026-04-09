import { Component } from '@angular/core';

import { signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  title = signal('');
  subtitle = signal('');

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateHeader(this.router.url);
    });

    // inicial
    this.updateHeader(this.router.url);
  }

  updateHeader(url: string) {
    switch (url) {
      case '/':
        this.title.set('English Maximizer School');
        this.subtitle.set('Lleva tu inglés al máximo nivel');
        break;

      case '/student':
        this.title.set('Zona Estudiante');
        this.subtitle.set('Aprende a tu ritmo');
        break;

      case '/teacher':
        this.title.set('Zona Profesor');
        this.subtitle.set('Comparte tu conocimiento');
        break;

      case '/blog':
        this.title.set('Blog');
        this.subtitle.set('Consejos y recursos');
        break;

      case '/contact':
        this.title.set('Contacto');
        this.subtitle.set('Estoy aquí para ayudarte');
        break;

      case '/about':
        this.title.set('English Maximizer School');
        this.subtitle.set('Lleva tu inglés al máximo nivel');
        break;

      default:
        this.title.set('English Maximizer School');
        this.subtitle.set('Lleva tu inglés al máximo nivel');
    }
  }
}
