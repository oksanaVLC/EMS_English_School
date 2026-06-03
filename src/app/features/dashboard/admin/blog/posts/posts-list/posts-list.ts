import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { PostModel } from '../../../../../../core/models/post.model';
import { Pagination } from '../../../../../../shared/components/pagination/pagination';

type PostStatus = '' | 'draft' | 'published';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [Pagination, RouterLink, FormsModule, CommonModule],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
})
export class PostsList implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  posts: PostModel[] = [];
  filteredPosts: PostModel[] = [];

  currentPage = 1;
  lastPage = 1;
  filterStatus: PostStatus = '';

  // Search properties
  searchTerm: string = '';
  searchDebounceTimer: any;

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
      .get<any>(`${this.apiUrl}/admin/posts`, {
        params,
        headers: { 'X-Skip-Loading': 'true' },
      })
      .subscribe({
        next: (res) => {
          this.posts = res.data || [];

          this.currentPage = res.current_page || 1;
          this.lastPage = res.last_page || 1;

          this.applySearchFilter(); // Apply search after loading

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
  | SEARCH FUNCTIONALITY
  |-----------------------------------------
  */
  onSearchInput() {
    // Clear previous timer
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    // Debounce search to avoid performance issues
    this.searchDebounceTimer = setTimeout(() => {
      this.applySearchFilter();
    }, 300);
  }

  applySearchFilter() {
    if (!this.searchTerm.trim()) {
      // No search term, show all posts from current filter
      this.filteredPosts = [...this.posts];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredPosts = this.posts.filter((post) => {
        const title = this.getPostTitle(post).toLowerCase();
        return title.includes(term);
      });
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.applySearchFilter();
  }

  isSearchMatch(post: PostModel): boolean {
    if (!this.searchTerm.trim()) return false;
    const term = this.searchTerm.toLowerCase().trim();
    const title = this.getPostTitle(post).toLowerCase();
    return title.includes(term);
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
    this.applySearchFilter(); // Re-apply search when language changes
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
    this.searchTerm = ''; // Clear search when changing filter
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
