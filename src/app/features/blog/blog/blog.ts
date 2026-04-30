import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

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
  private apiUrl = environment.apiUrl;

  posts: any[] = [];
  private stateKey = 'blog_state';

  currentPage = 1;
  lastPage = 1;

  viewMode: ViewMode = 'grid';

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

      // 👇 RESTAURAR ESTADO
      const saved = sessionStorage.getItem(this.stateKey);

      if (saved) {
        const state = JSON.parse(saved);

        // si venimos de otra página → recargar esa página
        if (state.page && state.page !== this.currentPage) {
          this.loadPosts(state.page);
          return;
        }

        // si estamos en la misma → restaurar scroll
        setTimeout(() => {
          window.scrollTo({
            top: state.scroll,
            behavior: 'auto',
          });
        }, 50);

        sessionStorage.removeItem(this.stateKey);
      }
    });
  }
  onPageChange(page: number) {
    this.loadPosts(page);
  }
}
