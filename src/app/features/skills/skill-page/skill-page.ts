import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LessonModel } from '../../../core/models/lesson-model';
import { Auth } from '../../../core/services/auth';
import { LoadingService } from '../../../core/services/loading';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-skill-page',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './skill-page.html',
  styleUrls: ['./skill-page.scss'],
})
export class SkillPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private loadingService = inject(LoadingService);

  private apiUrl = environment.apiUrl;

  skill: string = '';
  lessons: LessonModel[] = [];
  currentPage = 1;
  lastPage = 1;
  total = 0;
  error: string | null = null;
  searchTerm: string = '';
  selectedLevel: string | null = null;

  levels = [
    { label: 'Todos los niveles', value: null },
    { label: 'A1 - Beginner', value: 'A1' },
    { label: 'A2 - Elementary', value: 'A2' },
    { label: 'B1 - Intermediate', value: 'B1' },
    { label: 'B2 - Upper Intermediate', value: 'B2' },
    { label: 'C1 - Advanced', value: 'C1' },
    { label: 'C2 - Proficiency', value: 'C2' },
  ];

  // Configuración por skill
  skillConfig: Record<string, any> = {
    grammar: {
      title: 'Grammar',
      icon: 'fa-book',
      color: 'blue',
      description: 'Domina las reglas gramaticales del inglés',
    },
    vocabulary: {
      title: 'Vocabulary',
      icon: 'fa-language',
      color: 'purple',
      description: 'Aprende nuevas palabras organizadas por temas',
    },
    reading: {
      title: 'Reading',
      icon: 'fa-newspaper',
      color: 'green',
      description: 'Mejora tu comprensión lectora con textos auténticos',
    },
    listening: {
      title: 'Listening',
      icon: 'fa-headphones',
      color: 'teal',
      description: 'Entrena tu oído con audios y diálogos reales',
    },
    speaking: {
      title: 'Speaking',
      icon: 'fa-comments',
      color: 'orange',
      description: 'Practica tu pronunciación y fluidez conversacional',
    },
    writing: {
      title: 'Writing',
      icon: 'fa-pen-fancy',
      color: 'pink',
      description: 'Desarrolla tus habilidades de escritura',
    },
    pronunciation: {
      title: 'Pronunciation',
      icon: 'fa-microphone-alt',
      color: 'red',
      description: 'Perfecciona tu acento y pronunciación',
    },
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const skill = params.get('skill');
      if (!skill) return;

      this.skill = skill;
      this.currentPage = 1;
      this.searchTerm = '';
      this.selectedLevel = null;
      this.loadLessons();
    });
  }

  get currentConfig() {
    return (
      this.skillConfig[this.skill as keyof typeof this.skillConfig] ||
      this.skillConfig['vocabulary']
    );
  }
  loadLessons(page: number = 1) {
    this.loadingService.loadingOn();

    let params = new HttpParams()
      .set('page', page.toString())
      .set('type', this.skill)
      .set('status', 'published');

    if (this.selectedLevel) {
      const levelMap: Record<string, number> = {
        A1: 1,
        A2: 2,
        B1: 3,
        B2: 4,
        C1: 5,
        C2: 6,
      };
      const levelId = levelMap[this.selectedLevel];
      if (levelId) {
        params = params.set('level_id', levelId.toString());
      }
    }

    if (this.searchTerm) {
      params = params.set('search', this.searchTerm);
    }

    this.http.get<any>(`${this.apiUrl}/lessons`, { params }).subscribe({
      next: (res) => {
        this.lessons = res.data || [];
        this.currentPage = res.current_page || 1;
        this.lastPage = res.last_page || 1;
        this.total = res.total || 0;
        this.loadingService.loadingOff();
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.error = 'No se pudieron cargar las lecciones';
        this.loadingService.loadingOff();
      },
    });
  }

  onPageChange(page: number) {
    this.loadLessons(page);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.currentPage = 1;
    this.loadLessons(1);
  }

  setLevel(level: string | null) {
    this.selectedLevel = level;
    this.currentPage = 1;
    this.loadLessons(1);
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

  goToLesson(slug: string) {
    this.router.navigate(['/levels/all', slug]);
  }

  getLevelColor(level: string): string {
    switch (level?.toLowerCase()) {
      case 'a1':
        return 'a1';
      case 'a2':
        return 'a2';
      case 'b1':
        return 'b1';
      case 'b2':
        return 'b2';
      case 'c1':
        return 'c1';
      case 'c2':
        return 'c2';
      default:
        return 'a1';
    }
  }

  stripHtml(html: string): string {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
