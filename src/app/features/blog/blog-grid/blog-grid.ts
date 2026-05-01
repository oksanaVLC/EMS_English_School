import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-grid',
  standalone: true,
  imports: [CommonModule, DatePipe, SlicePipe],
  templateUrl: './blog-grid.html',
  styleUrl: './blog-grid.scss',
})
export class BlogGrid {
  private router = inject(Router);
  @Input() posts: any[] = [];
  @Input() currentPage!: number;
  @Input() favoriteLoading: { [key: number]: boolean } = {}; // ✅ NUEVO
  @Output() toggleFavorite = new EventEmitter<any>(); // ✅ NUEVO

  getExcerpt(post: any): string {
    return post?.short_description || post?.content || '';
  }

  goToPost(slug: string) {
    sessionStorage.setItem(
      'blog_state',
      JSON.stringify({
        page: this.currentPage,
        scroll: window.scrollY,
      }),
    );
    this.router.navigate(['/blog', slug]);
  }

  // ✅ NUEVO MÉTODO
  onToggleFavorite(post: any, event: Event) {
    event.stopPropagation();
    this.toggleFavorite.emit({ post, event });
  }
}
