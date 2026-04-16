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
        switchMap((response: any) => {
          console.log('Login response:', response);
          return this.http.get(`${this.apiUrl}/api/user`, {
            withCredentials: true,
          });
        }),
        tap((user: any) => {
          console.log('Usuario obtenido:', user);
          this.user.set(user);
        }),
      );
  }

  loadUser() {
    return this.http
      .get(`${this.apiUrl}/api/user`, { withCredentials: true })
      .pipe(tap((user: any) => this.user.set(user)));
  }

  logout() {
    return this.http
      .post(`${this.apiUrl}/api/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.user.set(null)));
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
