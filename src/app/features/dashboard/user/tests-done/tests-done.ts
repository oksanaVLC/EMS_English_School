import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { LoadingService } from '../../../../core/services/loading';
export interface TestResult {
  id: number;
  test_id: number;
  test_title: string;
  lesson_title: string;
  lesson_slug: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  percentage: number;
  status: string;
  completed_at: string;
}

interface PaginatedTests {
  current_page: number;
  data: TestResult[];
  last_page: number;
  per_page: number;
  total: number;
}

@Component({
  selector: 'app-tests-done',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tests-done.html',
  styleUrls: ['./tests-done.scss'],
})
export class TestsDone implements OnInit {
  tests: TestResult[] = [];
  error: string | null = null;
  loading: boolean = false;
  pagination: any = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };

  constructor(
    private http: HttpClient,
    public loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(page: number = 1): void {
    this.error = null;
    this.loadingService.loadingOn();

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('X-Skip-Loading', 'true');

    const apiUrl = `${environment.apiUrl}/user/tests/results?page=${page}`;

    this.http.get<PaginatedTests>(apiUrl, { headers }).subscribe({
      next: (response) => {
        this.tests = response.data;
        this.pagination = {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
        };
        this.loadingService.loadingOff();
      },
      error: (err) => {
        console.error('Error al cargar tests:', err);
        this.error = 'No se pudieron cargar tus tests realizados';
        this.loadingService.loadingOff();
      },
    });
  }

  loadPage(page: number): void {
    this.loadTests(page);
  }

  repeatTest(test: TestResult): void {
    // Navegar al test de la lección
    if (test.lesson_slug) {
      window.location.href = `/levels/all/${test.lesson_slug}?mode=test`;
    }
  }

  viewLesson(slug: string): void {
    window.location.href = `/levels/all/${slug}`;
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'regular';
    return 'low';
  }

  getScoreIcon(percentage: number): string {
    if (percentage >= 80) return 'fa-trophy';
    if (percentage >= 60) return 'fa-thumbs-up';
    if (percentage >= 40) return 'fa-hourglass-half';
    return 'fa-book-open';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
