import { SlicePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { Pagination } from '../../../../../../shared/components/pagination/pagination';

type PostStatus = '' | 'draft' | 'published';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [Pagination, RouterLink, SlicePipe],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
})
export class PostsList implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  posts: any[] = [];

  currentPage = 1;
  lastPage = 1;

  filterStatus: PostStatus = '';

  showDeleteModal = false;
  deleteId: number | null = null;

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts(page = 1, status: PostStatus = this.filterStatus) {
    let params = new HttpParams().set('page', page);

    if (status) {
      params = params.set('status', status);
    }

    this.http.get<any>(`${this.apiUrl}/api/posts`, { params }).subscribe((res) => {
      this.posts = res.data;

      this.currentPage = res.current_page;
      this.lastPage = res.last_page;
    });
  }

  nextPage() {
    if (this.currentPage < this.lastPage) {
      this.loadPosts(this.currentPage + 1, this.filterStatus);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadPosts(this.currentPage - 1, this.filterStatus);
    }
  }

  view(id: number) {
    this.router.navigate(['/admin/blog/posts/view', id]);
  }

  edit(id: number) {
    this.router.navigate(['/admin/blog/posts/edit', id]);
  }

  /*
  Para
    <button (click)="delete(post.id)" class="icon-btn danger">
                  <img src="/images/delete.png" alt="borrar" />
                  <span class="text">Borrar</span>
    </button>
                
    delete(id: number) {
    if (!confirm('¿Eliminar este artículo?')) return;

    this.http.delete(`${this.apiUrl}/api/posts/${id}`).subscribe({
      next: () => {
        this.loadPosts(this.currentPage, this.filterStatus);
      },
      error: (err) => {
        console.error(err);
        alert('Error al borrar el post');
      },
    });
  }*/

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

    this.http.delete(`${this.apiUrl}/api/posts/${this.deleteId}`).subscribe(() => {
      this.loadPosts(this.currentPage, this.filterStatus);
      this.closeDeleteModal();
    });
  }

  filter(status: PostStatus) {
    this.filterStatus = status;
    this.currentPage = 1;
    this.loadPosts(1, status);
  }
}
