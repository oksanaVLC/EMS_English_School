import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Auth } from '../../../core/services/auth'; // ajusta ruta si hace falta

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover?: string;
  created_at: string;
  title_en?: string;
  content_en?: string;
  is_favorited?: boolean;
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
  private sanitizer = inject(DomSanitizer);

  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  post: Post | null = null;

  auth = inject(Auth);

  // =========================
  // IDIOMA
  // =========================
  lang: 'es' | 'en' = 'es';

  // =========================
  // LIKE
  // =========================
  liked = false;
  likeLoading = false;

  // =========================
  // SHARE
  // =========================
  copied = false;

  // =========================
  // UX
  // =========================
  showLoginMessage = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) return;

      this.lang = 'es';
      this.loadPost(slug);
    });
  }

  private loadPost(slug: string) {
    this.http.get<Post>(`${this.apiUrl}/posts/slug/${slug}`).subscribe((res) => {
      this.post = res ?? null;
      this.liked = !!res?.is_favorited;
    });
  }

  // =========================
  // IDIOMA
  // =========================
  setLang(lang: 'es' | 'en'): void {
    if (lang === this.lang) return;
    if (lang === 'en' && !this.hasEnglishContent()) return;

    this.lang = lang;
  }

  hasEnglishContent(): boolean {
    return !!(this.post?.title_en || this.post?.content_en);
  }

  getTitle(): string {
    if (!this.post) return '';
    return this.lang === 'en' && this.hasEnglishContent()
      ? this.post.title_en || this.post.title
      : this.post.title;
  }

  getContent(): string {
    if (!this.post) return '';
    return this.lang === 'en' && this.hasEnglishContent()
      ? this.post.content_en || this.post.content
      : this.post.content;
  }

  getSafeContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getContent());
  }

  // =========================
  // LIKE (CON CONTROL DE AUTH)
  // =========================
  toggleLike(): void {
    if (!this.post || this.likeLoading) return;

    //  bloquear si no logueado
    if (!this.auth.isLoggedIn()) {
      this.showLoginMessage = true;
      setTimeout(() => (this.showLoginMessage = false), 3000);
      return;
    }

    //  bloquear doble click / requests simultáneas
    this.likeLoading = true;

    const previous = this.liked;

    // UI optimista
    this.liked = !previous;

    this.http.post(`${this.apiUrl}/posts/${this.post.id}/favorite`, {}).subscribe({
      next: (res: any) => {
        // sincronización backend
        this.liked = res.favorited;
        this.likeLoading = false;
      },
      error: () => {
        // rollback seguro
        this.liked = previous;
        this.likeLoading = false;
      },
    });
  }

  // =========================
  // SHARE
  // =========================
  sharePost(): void {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: this.getTitle(),
        url,
      });
      return;
    }

    navigator.clipboard.writeText(url).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
  printPost(): void {
    if (!this.post) return;

    const title = this.getTitle();
    const content = this.getContent();

    const printWindow = window.open('', '', 'width=900,height=700');

    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Imprimir</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #000;
          }

          .header {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 30px;
            letter-spacing: 1px;
          }

          h1 {
            font-size: 26px;
            margin-bottom: 20px;
          }

          .content {
            font-size: 14px;
            line-height: 1.7;
            white-space: pre-line; /* 👈 clave para saltos de línea */
          }
        </style>
      </head>

      <body>
        <div class="header">English Maximizer School</div>

        <h1>${title}</h1>

        <div class="content">${content}</div>
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }
}
