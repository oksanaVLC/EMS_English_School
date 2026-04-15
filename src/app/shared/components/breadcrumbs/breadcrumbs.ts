import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.html',
  styleUrls: ['./breadcrumbs.scss'],
})
export class Breadcrumbs {
  private router = inject(Router);

  private navEnd$ = toSignal(
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)),
    { initialValue: null },
  );

  // 👇 ocultar en home, login y register
  show = computed(() => {
    const event = this.navEnd$();
    if (!event) return false;

    const url = event.urlAfterRedirects.split('?')[0];

    const hiddenRoutes = ['/login', '/register'];

    return url !== '/' && !hiddenRoutes.includes(url);
  });

  // 👇 breadcrumbs mejorados
  breadcrumbs = computed<Breadcrumb[]>(() => {
    const event = this.navEnd$();
    if (!event) return [];

    const root: Breadcrumb = {
      label: 'Inicio',
      url: '/',
    };

    const segments = event.urlAfterRedirects.split('?')[0].split('/').filter(Boolean);

    let path = '';

    const crumbs: Breadcrumb[] = [root];

    for (const seg of segments) {
      path += `/${seg}`;

      crumbs.push({
        label: this.formatLabel(seg),
        url: path,
      });
    }

    return crumbs;
  });

  private formatLabel(seg: string): string {
    return seg.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
