import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-grid',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, SlicePipe],
  templateUrl: './blog-grid.html',
  styleUrl: './blog-grid.scss',
})
export class BlogGrid {
  @Input() posts: any[] = [];

  getExcerpt(post: any): string {
    return post?.short_description || post?.content || '';
  }
}
