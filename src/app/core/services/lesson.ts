import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/lessons`;

  getLessons(level: string) {
    return this.http.get(`${this.apiUrl}?level=${level}`);
  }

  getLessonBySlug(slug: string) {
    return this.http.get(`${this.apiUrl}/slug/${slug}`);
  }
}
