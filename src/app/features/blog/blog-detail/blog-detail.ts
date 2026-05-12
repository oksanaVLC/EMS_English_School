import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Auth } from '../../../core/services/auth';

import { PostModel } from '../../../core/models/post.model';

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

  post: PostModel | null = null;
  auth = inject(Auth);

  // =========================
  // IDIOMA
  // =========================
  lang: 'es' | 'en' = 'es';

  //  Eliminamos 'liked' y usamos directamente post.is_favorited
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
    // Construir headers con token si existe
    let headers = {};
    if (this.auth.isLoggedIn()) {
      const token = this.auth.getToken(); // Ajusta según tu servicio Auth
      headers = { Authorization: `Bearer ${token}` };
    }

    this.http.get<PostModel>(`${this.apiUrl}/posts/slug/${slug}`, { headers }).subscribe({
      next: (res) => {
        console.log('is_favorited:', res?.is_favorited);
        this.post = res ?? null;
      },
      error: (error) => {
        console.error('Error loading post:', error);
      },
    });
  }

  // =========================
  // GETTERS para estado de favorito
  // =========================
  get isFavorited(): boolean {
    return this.post?.is_favorited ?? false;
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
  // LIKE (FAVORITE) - CORREGIDO
  // =========================
  toggleLike(): void {
    if (!this.post || this.likeLoading) return;

    // Bloquear si no logueado
    if (!this.auth.isLoggedIn()) {
      this.showLoginMessage = true;
      setTimeout(() => (this.showLoginMessage = false), 3000);
      return;
    }

    this.likeLoading = true;

    // Guardar estado anterior para rollback
    const previousState = this.post.is_favorited;

    // ✅ UI optimista - actualizar directamente el post
    this.post.is_favorited = !previousState;

    this.http
      .post<{ favorited: boolean }>(`${this.apiUrl}/posts/${this.post.id}/favorite`, {})
      .subscribe({
        next: (res) => {
          // ✅ Sincronizar con la respuesta del backend
          if (this.post) {
            this.post.is_favorited = res.favorited;
          }
          this.likeLoading = false;
        },
        error: (error) => {
          console.error('Error toggling favorite:', error);
          // ✅ Rollback en caso de error
          if (this.post) {
            this.post.is_favorited = previousState;
          }
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
              white-space: pre-line;
            }
          </style>
        </head>
        <body>
          <div class="header">English Maximizer School</div>
          <h1>${this.escapeHtml(title)}</h1>
          <div class="content">${this.escapeHtml(content)}</div>
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

  //  Método de seguridad para evitar XSS en impresión
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
