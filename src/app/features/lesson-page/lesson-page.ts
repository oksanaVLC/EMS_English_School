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
    });
  }

  setMode(mode: 'learn' | 'video' | 'pdf' | 'test') {
    this.viewMode = mode;
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    const embedUrl = this.convertYoutubeUrl(url);

    console.log('Original URL:', url);
    console.log('Embed URL:', embedUrl);

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
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
