import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Button } from '../button/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, Button, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  animations: [
    trigger('rotateCookie', [
      state('inactive', style({ transform: 'rotate(0deg)' })),
      state('active', style({ transform: 'rotate(720deg)' })),
      transition('inactive => active', [animate('1000ms cubic-bezier(0.4, 0, 0.2, 1)')]),
    ]),
  ],
})
export class Navbar implements OnInit {
  private router = inject(Router);
  auth = inject(Auth);

  isOpen = signal(false);
  isLoggedIn = computed(() => this.auth.isLoggedIn());

  // Estado para la animación de la galleta
  cookieState = signal<'inactive' | 'active'>('inactive');

  ngOnInit() {
    const token = this.auth.getToken();
    if (token && !this.auth.getUser()) {
      this.auth.loadUser().subscribe({
        next: (user) => {
          console.log('Usuario cargado:', user);
        },
        error: (err) => {
          if (err.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          console.log('No hay usuario autenticado');
        },
      });
    }
  }

  // Toggle del menú con animación de la galleta
  toggleMenu(): void {
    const newState = !this.isOpen();
    this.isOpen.set(newState);

    if (newState) {
      // esperar a que la navbar termine de abrir
      setTimeout(() => {
        this.cookieState.set('active');

        setTimeout(() => {
          this.cookieState.set('inactive');
        }, 2500);
      }, 300); //  duración animación navbar
    }
  }

  closeMenu(): void {
    this.isOpen.set(false);
    // No resetear cookieState aquí para que no interfiera
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }

  getDashboardLink(): string {
    const user = this.auth.getUser();

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
