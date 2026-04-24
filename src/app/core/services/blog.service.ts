import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;

  is_favorited?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener listado de posts publicados
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts/published`);
  }

  // Obtener por slug
  getBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/slug/${slug}`);
  }

  // Obtener por id
  getById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  toggleFavorite(postId: number) {
    return this.http.post<{ favorited: boolean }>(`${this.apiUrl}/posts/${postId}/favorite`, {});
  }
}
