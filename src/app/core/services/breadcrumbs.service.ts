import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Breadcrumb } from '../models/breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private router = inject(Router);

  breadcrumbs = signal<Breadcrumb[]>([]);

  private hiddenRoutes = new Set(['/login', '/register', '/']);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.build());
  }

  private build() {
    const url = this.router.url;

    if (this.hiddenRoutes.has(url)) {
      this.breadcrumbs.set([]);
      return;
    }

    const segments = url.split('/').filter(Boolean);

    const list: Breadcrumb[] = [];

    let path = '';

    for (const segment of segments) {
      path += `/${segment}`;

      list.push({
        url: path,
        label: this.format(segment),
      });
    }

    if (list.length) {
      list.unshift({ url: '/', label: 'Inicio' });
    }

    this.breadcrumbs.set(list);
  }

  private format(value: string): string {
    if (!value) return '';

    const cleaned = value
      .split('#')[0]
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();

    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
}
