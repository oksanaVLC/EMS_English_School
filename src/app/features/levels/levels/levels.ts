import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Auth } from '../../../core/services/auth';
import { LessonService } from '../../../core/services/lesson';

interface Lesson {
  id: number;
  slug: string;
  title: string;
  type: string;
  tags: string[];
  is_favorited?: boolean;
  level?: string;
}

@Component({
  selector: 'app-levels',
  imports: [CommonModule],
  templateUrl: './levels.html',
  styleUrl: './levels.scss',
})
export class Levels implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lessonService = inject(LessonService);
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private apiUrl = environment.apiUrl;

  level: string = '';

  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];

  selectedType: string | null = null;

  skills = [
    { label: 'All', value: null },
    { label: 'Grammar', value: 'grammar' },
    { label: 'Vocabulary', value: 'vocabulary' },
    { label: 'Reading', value: 'reading' },
    { label: 'Listening', value: 'listening' },
    { label: 'Speaking', value: 'speaking' },
    { label: 'Writing', value: 'writing' },
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const level = params.get('level');
      if (!level) return;

      this.level = level;

      this.lessonService.getLessons(level).subscribe((res: any) => {
        this.lessons = res.data ?? [];
        this.applyFilters();
      });
    });
  }

  setType(type: string | null) {
    this.selectedType = type;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredLessons = this.lessons.filter((lesson) => {
      if (!this.selectedType) return true;
      return lesson.type?.toLowerCase() === this.selectedType;
    });
  }

  goToLesson(slug: string) {
    this.router.navigate(['/levels', this.level, slug]);
  }

  trackById(_: number, item: Lesson) {
    return item.id;
  }

  // =========================
  // FAVORITE TOGGLE (igual que posts)
  // =========================
  toggleFavorite(event: Event, lesson: Lesson) {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) return;

    const previous = lesson.is_favorited;

    lesson.is_favorited = !previous;

    this.http.post(`${this.apiUrl}/lessons/${lesson.id}/favorite`, {}).subscribe({
      next: (res: any) => {
        lesson.is_favorited = res.favorited;
      },
      error: () => {
        lesson.is_favorited = previous;
      },
    });
  }

  // =========================
  // UI helpers
  // =========================
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

  getLevelName(level: string): string {
    switch (level?.toLowerCase()) {
      case 'a1':
        return 'Basic';
      case 'a2':
        return 'Elementary';
      case 'b1':
        return 'Intermediate';
      case 'b2':
        return 'Upper-Intermediate';
      case 'c1':
        return 'Advanced';
      case 'c2':
        return 'Proficiency';
      default:
        return 'Level';
    }
  }
}
