import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import confetti from 'canvas-confetti';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-lesson-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson-test.html',
  styleUrl: './lesson-test.scss',
})
export class LessonTest implements OnInit {
  @Input() lessonId!: number;

  loading = false;
  saving = false;

  test: any;
  questions: any[] = [];

  answers: Record<number, number> = {};

  result: any = null;
  reviewMode = false;

  letters = ['A', 'B', 'C', 'D'];

  showSuccessAnimation = false;
  showFailMessage = false;
  failMessageTimeout: any;

  // Nueva propiedad para la fecha del último test
  lastCompletedDate: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTest();
    this.loadLastCompletedDate();
  }

  // Cargar fecha del último test desde localStorage
  loadLastCompletedDate() {
    const saved = localStorage.getItem(`test_${this.lessonId}_last_completed`);
    if (saved) {
      this.lastCompletedDate = saved;
    }
  }

  // Guardar fecha del último test en localStorage
  saveLastCompletedDate() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    this.lastCompletedDate = formattedDate;
    localStorage.setItem(`test_${this.lessonId}_last_completed`, formattedDate);
  }

  // Limpiar fecha (opcional, si quieres permitir reset)
  clearLastCompletedDate() {
    this.lastCompletedDate = null;
    localStorage.removeItem(`test_${this.lessonId}_last_completed`);
  }

  loadTest() {
    this.loading = true;

    this.http.get(`${environment.apiUrl}/lessons/${this.lessonId}/test`).subscribe({
      next: (res: any) => {
        if (res.status === 'published') {
          this.test = res;
          this.questions = res.questions || [];
        } else {
          this.test = null;
          this.questions = [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.test = null;
        this.questions = [];
      },
    });
  }

  selectOption(questionId: number, optionIndex: number) {
    this.answers[questionId] = optionIndex;
  }

  submitTest() {
    let correct = 0;
    const answersPayload: { question_id: number; option_id: number }[] = [];

    this.questions.forEach((q: any) => {
      const userOptionIndex = this.answers[q.id];
      const correctOptionIndex = q.options.findIndex((o: any) => o.is_correct);
      const selectedOption = q.options[userOptionIndex];

      if (userOptionIndex === correctOptionIndex) {
        correct++;
      }

      if (selectedOption) {
        answersPayload.push({
          question_id: q.id,
          option_id: selectedOption.id,
        });
      }
    });

    const total = this.questions.length;
    const percentage = correct / total;

    let comment = '';
    if (percentage < 0.5) {
      comment = 'Sigue practicando, ¡puedes hacerlo mejor!';
    } else if (percentage < 0.8) {
      comment = 'Buen trabajo, sigue así';
    } else {
      comment = '¡Excelente! Dominas este tema';
    }

    this.result = {
      correct,
      total,
      comment,
      percentage,
    };

    // Guardar la fecha del test completado
    this.saveLastCompletedDate();

    if (percentage >= 0.5) {
      this.showConfetti();
      this.showSuccessAnimation = true;
      setTimeout(() => {
        this.showSuccessAnimation = false;
      }, 3000);
    } else {
      this.showSadMessage();
    }

    this.saveTestResults(this.test.id, answersPayload, correct, total);
  }

  saveTestResults(testId: number, answers: any[], correct: number, total: number) {
    this.saving = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('X-Skip-Loading', 'true');

    const payload = { answers };

    this.http.post(`${environment.apiUrl}/tests/${testId}/submit`, payload, { headers }).subscribe({
      next: (response: any) => {
        console.log('Resultados guardados en el servidor:', response);
        this.result = {
          ...this.result,
          score_total: response.score_total,
          saved_in_backend: true,
        };
        this.saving = false;
      },
      error: (err) => {
        console.error('Error al guardar resultados:', err);
        this.saving = false;
      },
    });
  }

  showConfetti() {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      startVelocity: 25,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5, x: 0.3 },
        startVelocity: 30,
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5, x: 0.7 },
        startVelocity: 30,
      });
    }, 400);
  }

  showSadMessage() {
    this.showFailMessage = true;

    if (this.failMessageTimeout) {
      clearTimeout(this.failMessageTimeout);
    }

    this.failMessageTimeout = setTimeout(() => {
      this.showFailMessage = false;
    }, 4000);
  }

  retry() {
    this.result = null;
    this.reviewMode = false;
    this.answers = {};
    this.showSuccessAnimation = false;
    this.showFailMessage = false;

    // NO borrar lastCompletedDate - queremos que persista

    if (this.failMessageTimeout) {
      clearTimeout(this.failMessageTimeout);
    }
  }

  review() {
    this.reviewMode = true;
  }

  isCorrect(q: any, i: number) {
    const correctIndex = q.options.findIndex((o: any) => o.is_correct);
    return i === correctIndex;
  }

  isWrong(q: any, i: number) {
    const user = this.answers[q.id];
    const correctIndex = q.options.findIndex((o: any) => o.is_correct);
    return user === i && user !== correctIndex;
  }

  answeredCount(): number {
    return this.questions.filter((q) => this.answers[q.id] !== undefined).length;
  }
  getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  ngOnDestroy(): void {
    if (this.failMessageTimeout) {
      clearTimeout(this.failMessageTimeout);
    }
  }
}
