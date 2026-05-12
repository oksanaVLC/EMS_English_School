import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.scss',
})
export class LessonPage implements OnInit {
  lesson: any = null;

  viewMode: 'learn' | 'video' | 'pdf' | 'test' = 'learn';
  videoLoaded = false;

  videoThumb = '';

  safeVideoUrl!: SafeResourceUrl;

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

      if (this.lesson.video_url) {
        const videoId = this.extractYoutubeId(this.lesson.video_url);

        this.videoThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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

      // soporte para youtu.be
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.replace('/', '');
      }

      // soporte embed
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
  // En LessonPage component
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

      // caso watch?v=
      const videoId = parsed.searchParams.get('v');

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // caso ya embed
      if (url.includes('embed')) {
        return url;
      }

      return url;
    } catch (e) {
      console.log('Error parsing video URL:', url, e);
      return url;
    }
  }
}
