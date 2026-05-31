import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LessonModel } from '../../../core/models/lesson-model';
import { Auth } from '../../../core/services/auth';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './levels.html',
  styleUrl: './levels.scss',
})
export class Levels implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private apiUrl = environment.apiUrl;

  level: string = '';

  lessons: LessonModel[] = [];
  currentPage = 1;
  lastPage = 1;
  total = 0;

  selectedType: string | null = null;
  searchTerm: string = '';

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
      this.currentPage = 1;
      this.searchTerm = '';
      this.selectedType = null;
      this.loadLessons();
    });
  }

  loadLessons(page: number = 1) {
    const levelMap: Record<string, number> = {
      a1: 1,
      a2: 2,
      b1: 3,
      b2: 4,
      c1: 5,
      c2: 6,
    };

    const levelId = levelMap[this.level?.toLowerCase()];

    let params = new HttpParams()
      .set('page', page.toString())
      .set('level_id', levelId.toString())
      .set('status', 'published');

    // Añadir filtro de tipo si está seleccionado
    if (this.selectedType) {
      params = params.set('type', this.selectedType);
    }

    // Añadir búsqueda si hay término
    if (this.searchTerm) {
      params = params.set('search', this.searchTerm);
    }

    this.http.get<any>(`${this.apiUrl}/lessons`, { params }).subscribe({
      next: (res) => {
        this.lessons = res.data || [];
        this.currentPage = res.current_page || 1;
        this.lastPage = res.last_page || 1;
        this.total = res.total || 0;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
      },
    });
  }

  onPageChange(page: number) {
    this.loadLessons(page);
  }

  setType(type: string | null) {
    this.selectedType = type;
    this.currentPage = 1;
    this.loadLessons(1);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.currentPage = 1;
    this.loadLessons(1);
  }

  get filteredLessons(): LessonModel[] {
    return this.lessons;
  }

  goToLesson(slug: string) {
    this.router.navigate(['/levels', this.level, slug]);
  }

  toggleFavorite(event: Event, lesson: LessonModel) {
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
