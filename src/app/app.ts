import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Breadcrumbs } from './shared/components/breadcrumbs/breadcrumbs';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { Navbar } from './shared/components/navbar/navbar';
import { Spinner } from './shared/components/spinner/spinner';
import { Tags } from './shared/components/tags/tags';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Header, Footer, Tags, Breadcrumbs, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('EMS_Frontend_Angular');

  private router = inject(Router);
  private offset = 100;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.handleScroll();
      });
  }

  private handleScroll() {
    const url = this.router.url;

    const hasFragment = url.includes('#');

    // Home sin offset
    if (url === '/' || url.startsWith('/home')) {
      return;
    }

    //  SI hay fragmento, NO toques el scroll
    if (hasFragment) {
      return;
    }

    setTimeout(() => {
      window.scrollTo({
        top: this.offset,
        behavior: 'auto',
      });
    });
  }
}
