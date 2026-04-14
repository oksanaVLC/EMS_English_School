import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
export class Navbar implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  isOpen = signal(false);

  ngOnInit() {
    //  CLAVE: cargar usuario si no existe
    if (!this.auth.user()) {
      this.auth.getUser().subscribe();
    }
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  toggleMenu() {
    this.isOpen.set(!this.isOpen());
  }

  closeMenu() {
    this.isOpen.set(false);
  }

  getDashboardLink(): string {
    const user = this.auth.user();

    console.log('USER:', user);
    console.log('ROLE:', user?.role);

    const role = user?.role;

    if (role === 'admin') return '/dashboard/admin';
    if (role === 'teacher') return '/dashboard/teacher';
    if (role === 'user') return '/dashboard/user';

    return '/';
  }
}
