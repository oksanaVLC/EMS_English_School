import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core'; // ✅ Añade 'computed'
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Button } from '../button/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, Button, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  private router = inject(Router);
  auth = inject(Auth);

  isOpen = signal(false);

  // ✅ CORRECTO: Solo esta versión, elimina la otra
  isLoggedIn = computed(() => !!this.auth.user());

  ngOnInit() {
    this.auth.loadUser().subscribe({
      error: () => this.auth.user.set(null),
    });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        // ✅ Redirigir al login
        this.router.navigate(['/login']);
      },
      error: () => {
        // ✅ Aunque haya error, redirigir al login
        this.router.navigate(['/login']);
      },
    });
  }

  toggleMenu(): void {
    this.isOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  getDashboardLink(): string {
    const user = this.auth.user();

    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'teacher':
        return '/teacher';
      case 'user':
        return '/user';
      default:
        return '/';
    }
  }
}
