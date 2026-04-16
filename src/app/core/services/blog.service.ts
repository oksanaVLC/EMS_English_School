import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly baseUrl = '/api/blog';

  constructor(private http: HttpClient) {}

  // 📌 obtener listado
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}`);
  }

  // 📌 obtener por slug (para tu resolver actual)
  getBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/slug/${slug}`);
  }

  // 📌 obtener por id (si luego cambias arquitectura)
  getById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }
}
