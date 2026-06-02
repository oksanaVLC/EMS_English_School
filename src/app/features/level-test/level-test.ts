import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';
import { environment } from '../../../environments/environment';
import { Button } from '../../shared/components/button/button';

interface Question {
  id: number;
  level: string;
  question: string;
  explanation: string;
  options: Option[];
}

interface Option {
  id: number;
  text: string;
  correct: boolean;
}

interface Answer {
  questionId: number;
  optionId: number;
  correct: boolean;
}

interface LevelResult {
  level: string;
  message: string;
  description: string;
  icon: string;
}

interface SavedProgress {
  testId: number;
  answers: Answer[];
  currentIndex: number;
  timestamp: string;
}

@Component({
  selector: 'app-level-test',
  standalone: true,
  imports: [CommonModule, Button, RouterLink],
  templateUrl: './level-test.html',
  styleUrl: './level-test.scss',
})
export class LevelTest implements OnInit {
  questions: Question[] = [];
  currentIndex = 0;
  selectedOptionId: number | null = null;
  locked = false;

  answers: Answer[] = [];

  started = false;
  finished = false;
  loading = true;
  error: string | null = null;

  animatedScore = 0;
  showLoginBanner = false;
  resultSaved = false;
  showResumeDialog = false;

  // Backend
  private apiUrl = environment.apiUrl;
  private testId: number | null = null;
  savedProgress: SavedProgress | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTestFromBackend();
  }

  loadTestFromBackend() {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${this.apiUrl}/level-test`).subscribe({
      next: (response) => {
        if (response.success && response.questions) {
          this.questions = response.questions;
          this.testId = response.test_id;
          this.loading = false;

          // Verificar si hay progreso guardado
          this.checkForSavedProgress();
        } else {
          this.error = 'No se pudieron cargar las preguntas';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading level test:', err);
        this.error = 'Error al cargar el test. Inténtalo de nuevo.';
        this.loading = false;
      },
    });
  }

  // Verificar progreso guardado
  checkForSavedProgress() {
    const saved = localStorage.getItem('level_test_progress');
    if (!saved || !this.testId || this.questions.length === 0) {
      this.savedProgress = null;
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      const isValid =
        parsed &&
        parsed.testId === this.testId &&
        Array.isArray(parsed.answers) &&
        parsed.answers.length > 0 &&
        parsed.answers.length < this.questions.length &&
        typeof parsed.currentIndex === 'number' &&
        parsed.currentIndex < this.questions.length;

      if (isValid) {
        this.savedProgress = parsed;
        this.showResumeDialog = true;
      } else {
        this.cleanInvalidProgress();
      }
    } catch {
      this.cleanInvalidProgress();
    }
  }

  private cleanInvalidProgress() {
    localStorage.removeItem('level_test_progress');
    this.savedProgress = null;
    this.showResumeDialog = false;
  }

  // Continuar con progreso guardado
  resumeTest() {
    if (this.savedProgress) {
      this.answers = this.savedProgress.answers;
      this.currentIndex = this.savedProgress.currentIndex;
      this.started = true;
      this.finished = false;
      this.showLoginBanner = false;
      this.resultSaved = false;
      this.showResumeDialog = false;

      // Restaurar el estado de la pregunta actual
      const currentQuestionId = this.questions[this.currentIndex]?.id;
      const currentAnswer = this.answers.find((a) => a.questionId === currentQuestionId);

      if (currentAnswer) {
        this.selectedOptionId = currentAnswer.optionId;
        this.locked = true;
      } else {
        this.selectedOptionId = null;
        this.locked = false;
      }

      localStorage.removeItem('level_test_progress');
      this.savedProgress = null;
    }
  }

  // Empezar test nuevo (descartar progreso)
  startNewTest() {
    localStorage.removeItem('level_test_progress');
    this.savedProgress = null;
    this.showResumeDialog = false;
    this.startTest();
  }

  // Guardar progreso automáticamente
  saveProgressToLocalStorage() {
    if (this.started && !this.finished && this.answers.length > 0 && this.testId) {
      const progress: SavedProgress = {
        testId: this.testId,
        answers: this.answers,
        currentIndex: this.currentIndex,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('level_test_progress', JSON.stringify(progress));
    }
  }

  startTest() {
    if (!this.questions.length) return;

    localStorage.removeItem('level_test_progress');
    this.savedProgress = null;
    this.showResumeDialog = false;

    this.started = true;
    this.finished = false;
    this.showLoginBanner = false;
    this.resultSaved = false;

    this.currentIndex = 0;
    this.answers = [];
    this.selectedOptionId = null;
    this.locked = false;
  }

  currentQuestion(): Question {
    const q = this.questions[this.currentIndex];
    // Si ya hay una respuesta para esta pregunta, actualizar selectedOptionId
    const existingAnswer = this.answers.find((a) => a.questionId === q.id);
    if (existingAnswer && !this.locked) {
      this.selectedOptionId = existingAnswer.optionId;
      this.locked = true;
    }
    return q;
  }

  selectOption(optionId: number) {
    if (this.locked) return;

    this.selectedOptionId = optionId;

    const q = this.currentQuestion();
    const selected = q.options.find((o) => o.id === optionId);

    this.answers.push({
      questionId: q.id,
      optionId: optionId,
      correct: selected?.correct ?? false,
    });

    this.saveProgressToLocalStorage();
    this.locked = true;
  }

  next() {
    if (!this.locked) return;

    this.currentIndex++;
    this.selectedOptionId = null;
    this.locked = false;

    if (this.currentIndex >= this.questions.length) {
      this.started = false;
      this.finished = true;
      localStorage.removeItem('level_test_progress');

      this.animateScore();

      setTimeout(() => {
        this.showConfetti();
      }, 300);

      this.finishTestFlow();
    } else {
      this.saveProgressToLocalStorage();
    }
  }

  progress(): number {
    return (this.currentIndex / this.questions.length) * 100;
  }

  isSelected(opt: Option): boolean {
    return this.selectedOptionId === opt.id;
  }

  isCorrect(opt: Option): boolean {
    return this.locked && opt.correct;
  }

  isWrong(opt: Option): boolean {
    return this.locked && this.selectedOptionId === opt.id && !opt.correct;
  }

  get score(): number {
    return this.answers.filter((a) => a.correct).length;
  }

  levelResult(): LevelResult {
    const score = this.score;
    const total = this.questions.length;
    const percentage = (score / total) * 100;

    if (percentage <= 20) {
      return {
        level: 'A1',
        icon: 'fa-solid fa-seedling',
        message: '¡Estás empezando! Sigue aprendiendo, cada paso cuenta.',
        description:
          'Estás en los fundamentos del inglés. Con práctica constante, pronto podrás entender frases básicas y presentarte.',
      };
    }

    if (percentage <= 40) {
      return {
        level: 'A2',
        icon: 'fa-solid fa-book-open',
        message: '¡Buen comienzo! Tienes una base sólida, sigue practicando.',
        description:
          'Ya puedes entender frases cotidianas y comunicarte en situaciones simples. Sigue así para alcanzar el nivel intermedio.',
      };
    }

    if (percentage <= 60) {
      return {
        level: 'B1',
        icon: 'fa-solid fa-bullseye',
        message: '¡Ya alcanzas nivel Intermedio! Sigue mejorando.',
        description:
          'Tienes buen entendimiento y puedes mantener conversaciones sobre temas familiares. Sigue practicando para alcanzar niveles superiores.',
      };
    }

    if (percentage <= 80) {
      return {
        level: 'B2',
        icon: 'fa-solid fa-rocket',
        message: '¡Impresionante! Nivel Intermedio-Alto. Ya eres casi bilingüe.',
        description:
          'Puedes comunicarte con fluidez y naturalidad. Entiendes ideas complejas y textos técnicos. ¡Excelente trabajo!',
      };
    }

    return {
      level: 'C1',
      icon: 'fa-solid fa-trophy',
      message: '¡Excelente! Nivel Avanzado. Dominas el inglés.',
      description:
        'Tienes un dominio excepcional del idioma. Puedes expresarte con fluidez y precisión en cualquier situación. ¡Felicidades!',
    };
  }

  restartTest() {
    this.currentIndex = 0;
    this.answers = [];
    this.selectedOptionId = null;
    this.locked = false;

    this.started = false;
    this.finished = false;
    this.showLoginBanner = false;
    this.resultSaved = false;

    localStorage.removeItem('level_test_progress');
    this.savedProgress = null;

    this.loadTestFromBackend();
  }

  animateScore() {
    const target = this.score;
    const steps = 40;
    let current = 0;
    let i = 0;

    const interval = setInterval(() => {
      i++;
      current += target / steps;
      this.animatedScore = Math.round(current);

      if (i >= steps) {
        this.animatedScore = target;
        clearInterval(interval);
      }
    }, 25);
  }

  showConfetti() {
    confetti({
      particleCount: 130,
      spread: 90,
      startVelocity: 40,
      ticks: 100,
      origin: { y: 0.6 },
    });
  }

  saveResultToBackend() {
    const result = this.levelResult();

    const formattedAnswers = this.answers.map((answer) => ({
      question_id: answer.questionId,
      option_id: answer.optionId,
      correct: answer.correct,
    }));

    const payload = {
      score: this.score,
      total: this.questions.length,
      level: result.level,
      answers: formattedAnswers,
    };

    const token = localStorage.getItem('token');
    const options: any = {};
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }

    this.http.post(`${this.apiUrl}/level-test/save-result`, payload, options).subscribe({
      next: (response: any) => {
        console.log('Resultado guardado:', response);
        this.resultSaved = true;
        this.showLoginBanner = false;
      },
      error: (err) => {
        console.error('Error al guardar resultado:', err);
        if (err.status === 401) {
          this.showLoginBanner = true;
          this.resultSaved = false;
        }
      },
    });
  }

  finishTestFlow() {
    localStorage.removeItem('level_test_progress');

    const token = localStorage.getItem('token');
    if (token) {
      this.saveResultToBackend();
    } else {
      this.showLoginBanner = true;
      this.resultSaved = false;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  closeLoginBanner() {
    this.showLoginBanner = false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.started && !this.finished && this.answers.length > 0) {
      $event.returnValue = true;
    }
  }

  canDeactivate(): boolean {
    if (this.started && !this.finished && this.answers.length > 0) {
      const confirmExit = confirm(
        '⚠️ Tienes el test a mitad.\n¿Estás seguro de que quieres salir? El progreso se guardará automáticamente y podrás continuar después.',
      );
      if (!confirmExit) {
        return false;
      }
      return true;
    }
    return true;
  }
}
