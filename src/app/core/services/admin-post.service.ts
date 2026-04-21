import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  short_description: string | null;
  status: 'draft' | 'published';
  cover: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    surname: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminPostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todos los posts (para el listado de admin)
  getPosts(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/posts?page=${page}`);
  }

  // Obtener un post por ID
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  // Crear un nuevo post (con imagen)
  createPost(formData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, formData);
  }

  // Actualizar un post SIN imagen nueva
  updatePost(
    id: number,
    data: { title: string; content: string; status: string; short_description: string },
  ): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, data);
  }

  // Actualizar un post CON imagen nueva
  updatePostWithImage(id: number, formData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts/${id}`, formData);
  }

  // Eliminar un post
  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/posts/${id}`);
  }
}
