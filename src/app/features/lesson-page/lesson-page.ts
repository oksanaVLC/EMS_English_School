import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LessonTest } from './lesson-test/lesson-test';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [CommonModule, LessonTest],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.scss',
})
export class LessonPage implements OnInit {
  lesson: any = null;
  isFavorited: boolean = false;

  viewMode: 'learn' | 'video' | 'pdf' | 'test' = 'learn';
  videoLoaded = false;

  videoThumb = '';

  safeVideoUrl!: SafeResourceUrl;
  safePdfViewerUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    this.http.get(`${environment.apiUrl}/lessons/slug/${slug}`).subscribe((response: any) => {
      this.lesson = response;
      this.isFavorited = response.is_favorited || false;

      if (this.lesson.video_url) {
        const videoId = this.extractYoutubeId(this.lesson.video_url);
        this.videoThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

      if (this.lesson.pdf_url) {
        this.safePdfViewerUrl = this.getGoogleDriveViewerUrl(this.lesson.pdf_url);
      }
    });
  }

  setMode(mode: 'learn' | 'video' | 'pdf' | 'test') {
    this.viewMode = mode;
  }

  loadVideo() {
    if (!this.videoLoaded && this.lesson?.video_url) {
      const embedUrl = this.convertYoutubeUrl(this.lesson.video_url);
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${embedUrl}?autoplay=1&rel=0&controls=1`,
      );
      this.videoLoaded = true;
    }
  }

  extractYoutubeId(url: string): string {
    try {
      const parsed = new URL(url);
      const videoId = parsed.searchParams.get('v');
      if (videoId) return videoId;
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.replace('/', '');
      }
      if (url.includes('/embed/')) {
        return url.split('/embed/')[1];
      }
      return '';
    } catch {
      return '';
    }
  }

  goBack() {
    this.location.back();
  }

  getLevelName(level: string): string {
    switch (level?.toLowerCase()) {
      case 'a1':
        return 'Beginner Level';
      case 'a2':
        return 'Elementary Level';
      case 'b1':
        return 'Intermediate Level';
      case 'b2':
        return 'Upper Intermediate Level';
      case 'c1':
        return 'Advanced Level';
      case 'c2':
        return 'Proficiency Level';
      default:
        return 'English Level';
    }
  }

  getLevelColorClass(level: string): string {
    switch (level?.toLowerCase()) {
      case 'a1':
        return 'pink';
      case 'a2':
        return 'orange';
      case 'b1':
        return 'yellow';
      case 'b2':
        return 'green';
      case 'c1':
        return 'blue';
      case 'c2':
        return 'purple';
      default:
        return 'pink';
    }
  }

  convertYoutubeUrl(url: string): string {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('embed')) {
        return url;
      }
      return url;
    } catch (e) {
      console.log('Error parsing video URL:', url, e);
      return url;
    }
  }

  getGoogleDriveViewerUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');

    let fileId = '';

    const matchFileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchFileId && matchFileId[1]) {
      fileId = matchFileId[1];
    }

    const matchParamId = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (matchParamId && matchParamId[1]) {
      fileId = matchParamId[1];
    }

    const matchOpenId = url.match(/open\?id=([a-zA-Z0-9_-]+)/);
    if (matchOpenId && matchOpenId[1]) {
      fileId = matchOpenId[1];
    }

    if (fileId) {
      const viewerUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  downloadPdf(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toggleFavorite(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirigir a login o mostrar mensaje
      window.location.href = '/login';
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    this.http
      .post(`${environment.apiUrl}/lessons/${this.lesson.id}/favorite`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          this.isFavorited = response.favorited;

          console.log(this.isFavorited ? '✅ Añadido a favoritos' : '❌ Eliminado de favoritos');
        },
        error: (err) => {
          console.error('Error al cambiar favorito:', err);
          if (err.status === 401) {
            window.location.href = '/login';
          }
        },
      });
  }
}
