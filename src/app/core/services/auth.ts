import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiURL = environment.apiUrl + '/api';

  //  estado global
  user = signal<any | null>(null);

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, data, {
      withCredentials: true,
    });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/register`, data, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiURL}/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  getUser(): Observable<any> {
    return this.http
      .get(`${this.apiURL}/user`, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.user.set(user)));
  }

  //  versión usada por guards
  loadUser(): Observable<any> {
    return this.getUser();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
