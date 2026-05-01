import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { PostModel } from '../../../../core/models/post.model';
import { BackButton } from '../../../../shared/components/back-button/back-button';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-favorite-posts',
  imports: [RouterLink, CommonModule, DatePipe, Pagination, BackButton],
  templateUrl: './favorite-posts.html',
  styleUrl: './favorite-posts.scss',
})
export class FavoritePosts implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  posts: PostModel[] = [];
  loading = true;
  error = false;

  // Paginación
  currentPage = 1;
  lastPage = 1;
  total = 0;

  // Loading por post
  removingLoading: { [key: number]: boolean } = {};

  // Modal
  showModal = false;
  modalPost: PostModel | null = null;

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(page: number = 1): void {
    this.loading = true;
    this.error = false;
    this.currentPage = page;

    const params = new HttpParams().set('page', page);

    this.http.get<any>(`${this.apiUrl}/user/favorites`, { params }).subscribe({
      next: (res) => {
        this.posts = res?.data ?? [];
        this.currentPage = res?.current_page ?? 1;
        this.lastPage = res?.last_page ?? 1;
        this.total = res?.total ?? 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.loadFavorites(page);
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    window.history.back();
  }

  goToPost(slug: string): void {
    this.router.navigate(['/blog', slug]);
  }

  // ========== MODAL ==========
  openModal(post: PostModel, event: Event) {
    event.stopPropagation();
    this.modalPost = post;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalPost = null;
  }

  confirmRemove() {
    if (this.modalPost) {
      this.removeFavorite(this.modalPost);
    }
    this.closeModal();
  }

  // ========== REMOVER FAVORITO ==========
  removeFavorite(post: PostModel) {
    if (this.removingLoading[post.id]) return;

    this.removingLoading[post.id] = true;

    this.http
      .post<{ favorited: boolean }>(`${this.apiUrl}/posts/${post.id}/favorite`, {})
      .subscribe({
        next: () => {
          // Eliminar el post de la lista local
          this.posts = this.posts.filter((p) => p.id !== post.id);
          this.removingLoading[post.id] = false;

          // Si la página se quedó vacía y no es la primera, recargar página anterior
          if (this.posts.length === 0 && this.currentPage > 1) {
            this.loadFavorites(this.currentPage - 1);
          }
        },
        error: (err) => {
          console.error('Error removing favorite:', err);
          this.removingLoading[post.id] = false;
        },
      });
  }
}
