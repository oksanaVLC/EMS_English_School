import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover?: string;
  created_at: string;

  user?: {
    name: string;
    surname: string;
  };
}

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './blog-detail.html',
  styleUrls: ['./blog-detail.scss'],
})
export class BlogDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  post: Post | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) return;

      this.loadPost(slug);
    });
  }

  private loadPost(slug: string) {
    this.http.get<Post>(`${this.apiUrl}/api/posts/slug/${slug}`).subscribe((res) => {
      this.post = res ?? null;
    });
  }
}
