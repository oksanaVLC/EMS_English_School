import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiURL = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {}

  // =========================
  // AUTH (SANCTUM)
  // =========================

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

  // =========================
  // USER AUTH STATE
  // =========================

  getUser(): Observable<any> {
    return this.http.get(`${this.apiURL}/user`, {
      withCredentials: true,
    });
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
