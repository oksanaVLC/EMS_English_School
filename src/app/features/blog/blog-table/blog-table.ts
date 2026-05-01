import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-table.html',
  styleUrl: './blog-table.scss',
})
export class BlogTable {
  @Input() posts: any[] = [];
  @Input() favoriteLoading: { [key: number]: boolean } = {};
  @Output() toggleFavorite = new EventEmitter<any>();

  onToggleFavorite(post: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.toggleFavorite.emit({ post, event });
  }
}
