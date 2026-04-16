import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Auth {
  private apiUrl = environment.apiUrl; // ✅ Sin /api

  user = signal<any | null>(null);
  isLoggedIn = computed(() => !!this.user());

  constructor(private http: HttpClient) {}

  login(data: any) {
    console.log('Login intentado con:', data.email);

    return this.http
      .get(`${this.apiUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
      })
      .pipe(
        switchMap(() =>
          this.http.post(`${this.apiUrl}/api/login`, data, {
            withCredentials: true,
          }),
        ),
        tap((response: any) => {
          console.log('Login response:', response);
          // ✅ El usuario viene en response.user, no necesitas otra petición
          if (response && response.user) {
            this.user.set(response.user);
          }
        }),
      );
  }

  loadUser() {
    return this.http
      .get(`${this.apiUrl}/api/user`, { withCredentials: true })
      .pipe(tap((user: any) => this.user.set(user)));
  }

  logout() {
    console.log('Enviando petición de logout...');

    return this.http
      .post(
        `${this.apiUrl}/api/logout`,
        {},
        {
          withCredentials: true,
          observe: 'response',
        },
      )
      .pipe(
        tap({
          next: (response) => {
            console.log('Logout response status:', response.status);
            // Siempre limpiamos el usuario localmente
            this.user.set(null);
          },
          error: (error) => {
            console.error('Error en logout:', error);
            // Aún así limpiamos el usuario localmente
            this.user.set(null);
          },
        }),
      );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/api/register`, data, {
      withCredentials: true,
    });
  }

  setUser(user: any) {
    this.user.set(user);
  }
}
