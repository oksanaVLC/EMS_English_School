import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment'; // ✅ Importar environment
import { LoadingService } from '../../../../core/services/loading';

export type LessonType =
  | 'grammar'
  | 'vocabulary'
  | 'reading'
  | 'listening'
  | 'pronunciation'
  | 'writing'
  | 'speaking';

export type LessonStatus = 'draft' | 'published';

export interface LessonModel {
  id: number;
  title: string;
  slug: string;
  level_id: number;
  level: {
    id: number;
    code: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    name: string;
  } | null;
  type: LessonType;
  explanation: string;
  video_url?: string;
  pdf_url?: string;
  cover_url?: string;
  tags?: string[];
  order: number;
  status: LessonStatus;
  test?: {
    id: number;
    status: 'draft' | 'published';
  } | null;
  created_at?: string;
  is_favorited?: boolean;
}

interface PaginatedResponse {
  current_page: number;
  data: LessonModel[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

@Component({
  selector: 'app-favorite-lessons',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './favorite-lessons.html',
  styleUrls: ['./favorite-lessons.scss'],
})
export class FavoriteLessons implements OnInit {
  lessons: LessonModel[] = [];
  error: string | null = null;
  pagination: any = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };
  showModal: boolean = false;
  lessonToRemove: LessonModel | null = null;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.error = null;
    this.loadingService.loadingOn();

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('X-Skip-Loading', 'true');

    const apiUrl = `${environment.apiUrl}/user/lessons/favorites`;

    this.http.get<PaginatedResponse>(apiUrl, { headers }).subscribe({
      next: (response) => {
        console.log('✅ Lecciones favoritas cargadas:', response);
        this.lessons = response.data;
        this.pagination = {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
        };
        this.loadingService.loadingOff();
      },
      error: (err) => {
        console.error('❌ Error al cargar favoritos:', err);
        if (err.status === 401) {
          this.error = 'Por favor inicia sesión para ver tus lecciones favoritas';
        } else {
          this.error = 'No se pudieron cargar tus lecciones favoritas. Intenta de nuevo.';
        }
        this.loadingService.loadingOff();
      },
    });
  }

  loadPage(page: number): void {
    this.loadingService.loadingOn();

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('X-Skip-Loading', 'true');

    const apiUrl = `${environment.apiUrl}/user/lessons/favorites?page=${page}`;

    this.http.get<PaginatedResponse>(apiUrl, { headers }).subscribe({
      next: (response) => {
        this.lessons = response.data;
        this.pagination.current_page = response.current_page;
        this.loadingService.loadingOff();
      },
      error: (err) => {
        console.error('Error al cargar página:', err);
        this.error = 'Error al cargar la página';
        this.loadingService.loadingOff();
      },
    });
  }

  toggleFavorite(lesson: LessonModel): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('X-Skip-Loading', 'true');

    const apiUrl = `${environment.apiUrl}/lessons/${lesson.id}/favorite`;

    this.http.post(apiUrl, {}, { headers }).subscribe({
      next: (response: any) => {
        if (!response.favorited) {
          this.lessons = this.lessons.filter((l) => l.id !== lesson.id);
          this.pagination.total--;
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar favorito:', err);
      },
    });
  }

  viewLesson(slug: string): void {
    window.location.href = `/levels/all/${slug}`;
  }

  getLessonTypeName(type: LessonType): string {
    const types: Record<LessonType, string> = {
      grammar: 'Gramática',
      vocabulary: 'Vocabulario',
      reading: 'Lectura',
      listening: 'Listening',
      pronunciation: 'Pronunciación',
      writing: 'Escritura',
      speaking: 'Conversación',
    };
    return types[type] || type;
  }

  confirmRemove(lesson: LessonModel): void {
    this.lessonToRemove = lesson;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.lessonToRemove = null;
  }

  removeFavorite(): void {
    if (this.lessonToRemove) {
      this.toggleFavorite(this.lessonToRemove);
      this.closeModal();
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
