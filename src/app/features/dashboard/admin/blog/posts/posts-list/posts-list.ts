import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { PostModel } from '../../../../../../core/models/post.model';
import { Pagination } from '../../../../../../shared/components/pagination/pagination';

type PostStatus = '' | 'draft' | 'published';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [Pagination, RouterLink],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
})
export class PostsList implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  posts: PostModel[] = [];

  currentPage = 1;
  lastPage = 1;
  filterStatus: PostStatus = '';

  showDeleteModal = false;
  deleteId: number | null = null;

  currentLang: 'es' | 'en' = 'es';

  isLoading = false;

  ngOnInit() {
    this.loadPosts();
  }

  /*
  |-----------------------------------------
  | LOAD POSTS
  |-----------------------------------------
  */
  loadPosts(page = 1, status: PostStatus = this.filterStatus) {
    this.isLoading = true;

    let params = new HttpParams().set('page', page);

    if (status) {
      params = params.set('status', status);
    }

    this.http
      .get<any>(`${this.apiUrl}/posts`, {
        params,
        headers: { 'X-Skip-Loading': 'true' },
      })
      .subscribe({
        next: (res) => {
          this.posts = res.data || [];

          this.currentPage = res.current_page || 1;
          this.lastPage = res.last_page || 1;

          this.isLoading = false;

          console.log('📸 Posts cargados:', this.posts);
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }

  /*
  |-----------------------------------------
  | LANGUAGE HELPERS
  |-----------------------------------------
  */
  getPostTitle(post: PostModel): string {
    return (this.currentLang === 'en' ? post.title_en : post.title) || post.title || 'Sin título';
  }

  getPostContent(post: PostModel): string {
    return (this.currentLang === 'en' ? post.content_en : post.content) || post.content || '';
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
  }

  /*
  |-----------------------------------------
  | DELETE
  |-----------------------------------------
  */
  openDeleteModal(id: number) {
    this.deleteId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteId = null;
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.http.delete(`${this.apiUrl}/posts/${this.deleteId}`).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadPosts(this.currentPage, this.filterStatus);
      },
      error: console.error,
    });
  }

  /*
  |-----------------------------------------
  | FILTERS
  |-----------------------------------------
  */
  filter(status: PostStatus) {
    this.filterStatus = status;
    this.currentPage = 1;
    this.loadPosts(1, status);
  }

  /*
  |-----------------------------------------
  | UTILS
  |-----------------------------------------
  */
  truncate(text: string, len = 60): string {
    return text?.length > len ? text.slice(0, len) + '...' : text;
  }
}
