import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Auth } from '../../../core/services/auth';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { BlogGrid } from '../blog-grid/blog-grid';
import { BlogTable } from '../blog-table/blog-table';

type ViewMode = 'grid' | 'table';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, BlogGrid, BlogTable, Pagination],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = environment.apiUrl;

  posts: any[] = [];
  currentPage = 1;
  lastPage = 1;
  viewMode: ViewMode = 'grid';

  favoriteLoading: { [key: number]: boolean } = {};

  // Modal integrado
  showModal = false;
  modalPost: any = null;
  showLoginToast = false;
  private toastTimeout: any;

  ngOnInit(): void {
    this.loadPosts();
  }

  setView(mode: ViewMode) {
    this.viewMode = mode;
  }

  loadPosts(page: number = 1): void {
    const params = new HttpParams().set('page', page);
    this.http.get<any>(`${this.apiUrl}/posts/published`, { params }).subscribe((res) => {
      this.posts = res?.data ?? [];
      this.currentPage = res?.current_page ?? 1;
      this.lastPage = res?.last_page ?? 1;
    });
  }

  onPageChange(page: number) {
    this.loadPosts(page);
  }

  // ========== MÉTODOS DE FAVORITOS ==========

  onToggleFavorite(event: { post: any; event?: Event }) {
    const post = event.post;

    // Usuario no logueado
    if (!this.auth.isLoggedIn()) {
      this.showLoginToastMessage();
      return;
    }

    // Si QUIERE QUITAR favorito → modal de confirmación
    if (post.is_favorited) {
      this.openModal(post);
      return;
    }

    // Si QUIERE AÑADIR favorito → directo (UI optimista)
    this.addFavorite(post);
  }

  private showLoginToastMessage() {
    this.showLoginToast = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showLoginToast = false;
    }, 3000);
  }

  // Modal
  openModal(post: any) {
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

  private addFavorite(post: any) {
    if (this.favoriteLoading[post.id]) return;

    this.favoriteLoading[post.id] = true;
    const previousState = post.is_favorited;

    // UI optimista INMEDIATA
    post.is_favorited = true;

    this.http
      .post<{ favorited: boolean }>(`${this.apiUrl}/posts/${post.id}/favorite`, {})
      .subscribe({
        next: (res) => {
          post.is_favorited = res.favorited;
          this.favoriteLoading[post.id] = false;
        },
        error: () => {
          post.is_favorited = previousState;
          this.favoriteLoading[post.id] = false;
        },
      });
  }

  private removeFavorite(post: any) {
    if (this.favoriteLoading[post.id]) return;

    this.favoriteLoading[post.id] = true;

    // UI optimista INMEDIATA
    post.is_favorited = false;

    this.http
      .post<{ favorited: boolean }>(`${this.apiUrl}/posts/${post.id}/favorite`, {})
      .subscribe({
        next: (res) => {
          post.is_favorited = res.favorited;
          this.favoriteLoading[post.id] = false;
        },
        error: () => {
          post.is_favorited = true;
          this.favoriteLoading[post.id] = false;
        },
      });
  }
}
