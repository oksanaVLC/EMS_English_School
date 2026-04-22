import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
  avatar_url?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  abilities: string[];
  token_name: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private apiUrl = environment.apiUrl;

  //  Signals para reactividad
  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly(); // Exponer como readonly

  isLoggedIn = computed(() => !!this.userSignal());

  constructor(private http: HttpClient) {
    // Cargar usuario desde localStorage al iniciar
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userSignal.set(user);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
  }

  register(data: {
    name: string;
    surname: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<LoginResponse> {
    console.log('=== LOGIN DEBUG ===');
    console.log('URL:', `${this.apiUrl}/login`);
    console.log('Datos enviados:', {
      email: data.email,
      password: '***',
      device_name: 'angular_web_app',
    });

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        email: data.email,
        password: data.password,
        device_name: 'angular_web_app',
      })
      .pipe(
        tap({
          next: (response) => {
            console.log('✅ Login exitoso:', response);
            console.log('Token recibido:', response.token ? 'Sí' : 'No');
            console.log('Usuario:', response.user);

            if (response.token) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response.user));
              this.userSignal.set(response.user);
              console.log('✅ Token y usuario guardados en localStorage');
            }
          },
          error: (error) => {
            console.error('❌ Login falló:', error);
            console.error('Status:', error.status);
            console.error('Status text:', error.statusText);
            console.error('Error body:', error.error);

            if (error.status === 422 && error.error?.errors) {
              console.error('📋 Errores de validación:');
              Object.keys(error.error.errors).forEach((key) => {
                console.error(`  ${key}: ${error.error.errors[key].join(', ')}`);
              });
            } else if (error.status === 401) {
              console.error('🔐 Credenciales incorrectas');
            } else if (error.status === 419) {
              console.error('🍪 Error CSRF - Problema con cookies/sesiones');
            }
          },
        }),
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSignal.set(null);
      }),
    );
  }

  loadUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`).pipe(
      tap((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSignal.set(user);
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.userSignal.set(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        return of(null as any);
      }),
    );
  }

  getUser(): User | null {
    return this.userSignal();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: User | null) {
    console.log('Guardando usuario:', user);
    this.userSignal.set(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
}
