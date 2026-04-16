import { Component, inject, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface Breadcrumb {
  url: string;
  label: string;
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

  breadcrumbs: WritableSignal<Breadcrumb[]> = signal([]);
  show = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.buildBreadcrumbs());
  }

  private buildBreadcrumbs(): void {
    const segments = this.router.url.split('/').filter(Boolean);

    const breadcrumbs: Breadcrumb[] = [];

    let url = '';

    for (const segment of segments) {
      url += `/${segment}`;

      const label = this.getLabel(segment);

      if (!label) continue;

      // 👇 ocultamos segmentos técnicos PERO seguimos avanzando URL
      if (this.hiddenSegments.has(segment)) continue;

      breadcrumbs.push({ url, label });
    }

    // 👇 SOLO añadir Inicio si NO estamos en home
    if (breadcrumbs.length > 0) {
      breadcrumbs.unshift({ url: '/', label: 'Inicio' });
    }

    this.breadcrumbs.set(breadcrumbs);
    this.show.set(breadcrumbs.length > 1);
  }

  private getLabel(segment: string): string | null {
    const map: Record<string, string> = {
      admin: 'Admin',
      users: 'Usuarios',
      posts: 'Posts',
      create: 'Crear post',
      edit: 'Editar',
      view: 'Ver',

      about: 'Sobre nosotros',
      blog: 'Blog',
      login: 'Login',
      register: 'Registro',
      'level-test': 'Test de nivel',
    };

    return map[segment] ?? segment; // 👈 IMPORTANTE cambio aquí
  }

  private hiddenSegments = new Set(['edit', 'view']);
}
