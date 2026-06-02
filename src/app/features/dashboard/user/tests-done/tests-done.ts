import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { LoadingService } from '../../../../core/services/loading';
import { Pagination } from '../../../../shared/components/pagination/pagination';

export interface TestResult {
  id: number;
  test_id: number;
  test_title: string;
  lesson_title: string;
  lesson_slug: string;
  lesson_level?: string;
  lesson_skill?: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  percentage: number;
  status: string;
  completed_at: string;
}

export interface GroupedLesson {
  lesson_title: string;
  lesson_slug: string;
  level: string;
  skill: string;
  attempts: TestResult[];
  best_score: number;
  best_percentage: number;
  average_percentage: number;
  last_attempt_date: string;
  attempt_count: number;
}

export interface LevelStat {
  level: string;
  tests: number;
  average: number;
  status: string;
  statusIcon: string;
  statusClass: string;
}

export interface SkillOption {
  name: string;
  value: string;
  icon: string;
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
  imports: [CommonModule, Pagination, RouterLink],
  templateUrl: './tests-done.html',
  styleUrls: ['./tests-done.scss'],
})
export class TestsDone implements OnInit {
  tests: TestResult[] = [];
  groupedLessons: GroupedLesson[] = [];
  filteredGroupedLessons: GroupedLesson[] = [];
  error: string | null = null;
  pagination: any = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };

  // Level Test Results
  levelTestResult: {
    level: string;
    score: number;
    total: number;
    percentage: number;
    completed_at: string;
  } | null = null;

  // KPI metrics
  totalTests: number = 0;
  globalAverage: number = 0;
  bestStreak: number = 0;
  weeklyProgress: number = 0;
  masteredLessons: number = 0;

  // Estadísticas de tests
  passedTests: number = 0;
  failedTests: number = 0;
  passRate: number = 0;

  // Nivel estimado
  estimatedLevel: string = 'A1';
  levelStats: LevelStat[] = [];

  // Filtros
  selectedLevel: string = 'all';
  selectedSkill: string = 'all';
  searchKeyword: string = '';
  levels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  skills: SkillOption[] = [
    { name: 'Gramática', value: 'grammar', icon: 'fas fa-book' },
    { name: 'Vocabulario', value: 'vocabulary', icon: 'fas fa-language' },
    { name: 'Lectura', value: 'reading', icon: 'fas fa-newspaper' },
    { name: 'Listening', value: 'listening', icon: 'fas fa-headphones' },
    { name: 'Speaking', value: 'speaking', icon: 'fas fa-comments' },
    { name: 'Escritura', value: 'writing', icon: 'fas fa-pen-fancy' },
    { name: 'Pronunciación', value: 'pronunciation', icon: 'fas fa-microphone-alt' },
  ];

  // Flags y mensajes dinámicos
  hasWeeklyData: boolean = true;
  weeklyMessage: string = '';
  weeklyIcon: string = '';

  constructor(
    private http: HttpClient,
    public loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loadTests();
    this.loadLevelTestResult();
  }

  loadTests(page: number = 1): void {
    this.error = null;
    this.loadingService.loadingOn();

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('X-Skip-Loading', 'true');

    const apiUrl = `${environment.apiUrl}/user/tests/results?page=${page}&per_page=100`;

    this.http.get<PaginatedTests>(apiUrl, { headers }).subscribe({
      next: (response) => {
        this.tests = response.data;
        this.totalTests = response.total;
        this.pagination = {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
        };
        this.groupTestsByLesson();
        this.calculateKPIs();
        this.calculateLevelStats();
        this.calculateTestStats();
        this.applyFilters();
        this.loadingService.loadingOff();
      },
      error: (err) => {
        console.error('Error al cargar tests:', err);
        this.error = 'No se pudieron cargar tus tests realizados';
        this.loadingService.loadingOff();
      },
    });
  }

  groupTestsByLesson(): void {
    const grouped = new Map<string, { attempts: TestResult[]; level: string; skill: string }>();

    this.tests.forEach((test) => {
      const key = test.lesson_title;
      if (!grouped.has(key)) {
        grouped.set(key, {
          attempts: [],
          level: test.lesson_level || this.extractLevelFromTitle(test.lesson_title),
          skill: test.lesson_skill || this.extractSkillFromTitle(test.lesson_title),
        });
      }
      grouped.get(key)!.attempts.push(test);
    });

    this.groupedLessons = Array.from(grouped.entries()).map(([title, data]) => {
      const sortedAttempts = data.attempts.sort(
        (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
      );

      const bestAttempt = sortedAttempts.reduce((best, current) =>
        current.percentage > best.percentage ? current : best,
      );

      const averagePercentage = Math.round(
        data.attempts.reduce((sum, a) => sum + a.percentage, 0) / data.attempts.length,
      );

      return {
        lesson_title: title,
        lesson_slug: bestAttempt.lesson_slug,
        level: data.level,
        skill: data.skill,
        attempts: sortedAttempts.slice(0, 4),
        best_score: bestAttempt.score,
        best_percentage: bestAttempt.percentage,
        average_percentage: averagePercentage,
        last_attempt_date: sortedAttempts[0].completed_at,
        attempt_count: data.attempts.length,
      };
    });

    this.groupedLessons.sort(
      (a, b) => new Date(b.last_attempt_date).getTime() - new Date(a.last_attempt_date).getTime(),
    );
  }

  extractLevelFromTitle(title: string): string {
    const levelMatch = title.match(/^(A1|A2|B1|B2|C1|C2)/i);
    if (levelMatch) {
      return levelMatch[1].toUpperCase();
    }
    return 'A1';
  }

  extractSkillFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('grammar') || lowerTitle.includes('gramática')) return 'grammar';
    if (lowerTitle.includes('vocabulary') || lowerTitle.includes('vocabulario'))
      return 'vocabulary';
    if (lowerTitle.includes('reading') || lowerTitle.includes('lectura')) return 'reading';
    if (lowerTitle.includes('listening')) return 'listening';
    if (lowerTitle.includes('speaking')) return 'speaking';
    if (lowerTitle.includes('writing') || lowerTitle.includes('escritura')) return 'writing';
    if (lowerTitle.includes('pronunciation') || lowerTitle.includes('pronunciación'))
      return 'pronunciation';
    return 'grammar';
  }

  getSkillIcon(skill: string): string {
    const icons: Record<string, string> = {
      grammar: 'fas fa-book',
      vocabulary: 'fas fa-language',
      reading: 'fas fa-newspaper',
      listening: 'fas fa-headphones',
      speaking: 'fas fa-comments',
      writing: 'fas fa-pen-fancy',
      pronunciation: 'fas fa-microphone-alt',
    };
    return icons[skill] || 'fas fa-book';
  }

  getSkillName(skill: string): string {
    const names: Record<string, string> = {
      grammar: 'Gramática',
      vocabulary: 'Vocabulario',
      reading: 'Lectura',
      listening: 'Listening',
      speaking: 'Speaking',
      writing: 'Escritura',
      pronunciation: 'Pronunciación',
    };
    return names[skill] || skill;
  }

  calculateTestStats(): void {
    let testsToAnalyze = this.tests;

    if (this.selectedLevel !== 'all') {
      testsToAnalyze = this.tests.filter((test) => {
        const level = test.lesson_level || this.extractLevelFromTitle(test.lesson_title);
        return level === this.selectedLevel;
      });
    }

    this.passedTests = testsToAnalyze.filter((t) => t.percentage >= 60).length;
    this.failedTests = testsToAnalyze.filter((t) => t.percentage < 60).length;
    this.passRate =
      testsToAnalyze.length > 0 ? Math.round((this.passedTests / testsToAnalyze.length) * 100) : 0;
  }

  applyFilters(): void {
    let filtered = [...this.groupedLessons];

    if (this.selectedLevel !== 'all') {
      filtered = filtered.filter((lesson) => lesson.level === this.selectedLevel);
    }

    if (this.selectedSkill !== 'all') {
      filtered = filtered.filter((lesson) => lesson.skill === this.selectedSkill);
    }

    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      filtered = filtered.filter((lesson) => lesson.lesson_title.toLowerCase().includes(keyword));
    }

    this.filteredGroupedLessons = filtered;
    this.calculateTestStats();
  }

  onLevelChange(level: string): void {
    this.selectedLevel = level;
    this.applyFilters();
  }

  onSkillChange(skill: string): void {
    this.selectedSkill = skill;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchKeyword = input.value;
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedLevel = 'all';
    this.selectedSkill = 'all';
    this.searchKeyword = '';
    this.applyFilters();
  }

  calculateKPIs(): void {
    if (this.tests.length > 0) {
      const sum = this.tests.reduce((acc, t) => acc + t.percentage, 0);
      this.globalAverage = Math.round(sum / this.tests.length);
    }

    this.masteredLessons = this.groupedLessons.filter((l) => l.best_percentage >= 80).length;
    this.calculateBestStreak();
    this.calculateWeeklyProgress();
  }

  calculateLevelStats(): void {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const levelScores: Record<string, { tests: number; totalPercentage: number }> = {};

    levels.forEach((level) => {
      levelScores[level] = { tests: 0, totalPercentage: 0 };
    });

    this.tests.forEach((test) => {
      const level = test.lesson_level || this.extractLevelFromTitle(test.lesson_title);
      if (levelScores[level]) {
        levelScores[level].tests++;
        levelScores[level].totalPercentage += test.percentage;
      }
    });

    this.levelStats = levels.map((level) => {
      const stats = levelScores[level];
      const average = stats.tests > 0 ? Math.round(stats.totalPercentage / stats.tests) : 0;
      let status = '';
      let statusIcon = '';
      let statusClass = '';

      if (stats.tests === 0) {
        status = 'Sin tests';
        statusIcon = 'fas fa-hourglass-start';
        statusClass = 'empty';
      } else if (average >= 80) {
        status = 'Dominado';
        statusIcon = 'fas fa-crown';
        statusClass = 'mastered';
      } else if (average >= 60) {
        status = 'Aprobado';
        statusIcon = 'fas fa-check-circle';
        statusClass = 'passed';
      } else {
        status = 'Mejorable';
        statusIcon = 'fas fa-exclamation-triangle';
        statusClass = 'needs-work';
      }

      return {
        level,
        tests: stats.tests,
        average,
        status,
        statusIcon,
        statusClass,
      };
    });

    let currentLevel = 'A1';
    for (let i = 0; i < this.levelStats.length; i++) {
      if (this.levelStats[i].tests > 0 && this.levelStats[i].average >= 60) {
        currentLevel = this.levelStats[i].level;
      } else if (this.levelStats[i].tests > 0) {
        currentLevel = this.levelStats[i].level;
        break;
      }
    }
    this.estimatedLevel = currentLevel;
  }

  calculateBestStreak(): void {
    if (this.tests.length === 0) {
      this.bestStreak = 0;
      return;
    }

    const dates = this.tests.map((t) => new Date(t.completed_at).toDateString());
    const uniqueDates = [...new Set(dates)].sort();

    let currentStreak = 1;
    let maxStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    this.bestStreak = maxStreak;
  }

  calculateWeeklyProgress(): void {
    const now = new Date();
    const currentWeekStart = this.getWeekStart(now);
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const testsThisWeek = this.tests.filter((t) => {
      const date = new Date(t.completed_at);
      return date >= currentWeekStart;
    });

    const testsLastWeek = this.tests.filter((t) => {
      const date = new Date(t.completed_at);
      return date >= lastWeekStart && date < currentWeekStart;
    });

    const avgThisWeek =
      testsThisWeek.length > 0
        ? testsThisWeek.reduce((s, t) => s + t.percentage, 0) / testsThisWeek.length
        : 0;

    const avgLastWeek =
      testsLastWeek.length > 0
        ? testsLastWeek.reduce((s, t) => s + t.percentage, 0) / testsLastWeek.length
        : 0;

    if (testsThisWeek.length === 0) {
      this.hasWeeklyData = false;
      this.weeklyProgress = 0;
      this.weeklyMessage = 'Sin actividad esta semana';
      this.weeklyIcon = 'fa-calendar-week';
    } else if (testsLastWeek.length === 0) {
      this.hasWeeklyData = false;
      this.weeklyProgress = 0;
      this.weeklyMessage = 'Primer test - continúa la próxima semana';
      this.weeklyIcon = 'fa-calendar-star';
    } else {
      this.hasWeeklyData = true;
      const change = ((avgThisWeek - avgLastWeek) / avgLastWeek) * 100;
      this.weeklyProgress = Math.round(change);

      if (this.weeklyProgress > 10) {
        this.weeklyMessage = 'Mejorando rápidamente';
        this.weeklyIcon = 'fa-rocket';
      } else if (this.weeklyProgress > 0) {
        this.weeklyMessage = 'Mejorando respecto a la semana pasada';
        this.weeklyIcon = 'fa-arrow-up';
      } else if (this.weeklyProgress === 0) {
        this.weeklyMessage = 'Mismo nivel que la semana pasada';
        this.weeklyIcon = 'fa-minus';
      } else if (this.weeklyProgress < -10) {
        this.weeklyMessage = 'Semana para repasar';
        this.weeklyIcon = 'fa-arrow-down';
      } else {
        this.weeklyMessage = 'Ligero descenso, sigue practicando';
        this.weeklyIcon = 'fa-heart';
      }
    }
  }

  getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  loadPage(page: number): void {
    this.loadTests(page);
  }

  repeatTest(lesson: GroupedLesson): void {
    if (lesson.lesson_slug) {
      window.location.href = `/levels/all/${lesson.lesson_slug}?mode=test`;
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

  getWeeklyProgressColor(): string {
    if (!this.hasWeeklyData) return 'neutral';
    if (this.weeklyProgress > 5) return 'positive';
    if (this.weeklyProgress < -5) return 'negative';
    return 'neutral';
  }

  getWeeklyProgressIcon(): string {
    if (!this.hasWeeklyData) return 'fa-chart-simple';
    if (this.weeklyProgress > 5) return 'fa-arrow-up';
    if (this.weeklyProgress < -5) return 'fa-arrow-down';
    return 'fa-minus';
  }

  getConfidenceTooltip(): string {
    const totalTests = this.tests.length;
    if (totalTests < 3) {
      return 'Basado en pocos tests. Completa más tests para una estimación más precisa.';
    } else if (totalTests < 10) {
      return 'Estimación basada en varios tests. Sigue practicando para mayor precisión.';
    }
    return 'Estimación fiable basada en muchos tests. ¡Buen trabajo!';
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;
    return d.toLocaleDateString('es-ES');
  }

  getLessonLevel(lesson: GroupedLesson): string {
    return lesson.level || 'A1';
  }

  getFilterInfo(): string {
    if (this.selectedLevel !== 'all' && this.selectedSkill !== 'all') {
      return `${this.selectedLevel} · ${this.getSkillName(this.selectedSkill)}`;
    } else if (this.selectedLevel !== 'all') {
      return `Nivel ${this.selectedLevel}`;
    } else if (this.selectedSkill !== 'all') {
      return this.getSkillName(this.selectedSkill);
    }
    return 'todos los niveles y skills';
  }

  loadLevelTestResult() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${environment.apiUrl}/user/tests/level-test-result`, { headers }).subscribe({
      next: (response: any) => {
        if (response.success && response.result) {
          this.levelTestResult = response.result;
        }
      },
      error: (err) => {
        console.log('No hay resultado de level test:', err);
      },
    });
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
