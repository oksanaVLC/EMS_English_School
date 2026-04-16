import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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

  isLoggedIn = this.auth.user;
  ngOnInit() {
    this.auth.loadUser().subscribe({
      error: () => this.auth.user.set(null),
    });
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  toggleMenu(): void {
    this.isOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  getDashboardLink(): string {
    const user = this.auth.user(); // ✅ SIEMPRE ()

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
