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
    const levelMap: Record<string, number> = {
      a1: 1,
      a2: 2,
      b1: 3,
      b2: 4,
      c1: 5,
      c2: 6,
    };

    const levelId = levelMap[level?.toLowerCase()];

    if (!levelId) {
      return this.http.get(`${this.apiUrl}`);
    }

    return this.http.get(`${this.apiUrl}?level_id=${levelId}`);
  }

  getLessonBySlug(slug: string) {
    return this.http.get(`${this.apiUrl}/slug/${slug}`);
  }
}
