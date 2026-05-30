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
  saving = false; // ✅ Añadir estado de guardado

  test: any;
  questions: any[] = [];

  answers: Record<number, number> = {};

  result: any = null;
  reviewMode = false;

  letters = ['A', 'B', 'C', 'D'];

  // Para animación de fuegos artificiales
  showSuccessAnimation = false;
  showFailMessage = false;
  failMessageTimeout: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTest();
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
    // Calcular resultados localmente primero
    let correct = 0;
    const answersPayload: { question_id: number; option_id: number }[] = [];

    this.questions.forEach((q: any) => {
      const userOptionIndex = this.answers[q.id];
      const correctOptionIndex = q.options.findIndex((o: any) => o.is_correct);
      const selectedOption = q.options[userOptionIndex];

      if (userOptionIndex === correctOptionIndex) {
        correct++;
      }

      // Preparar payload para el backend
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

    // Mostrar resultado localmente
    this.result = {
      correct,
      total,
      comment,
      percentage,
    };

    // Mostrar animación según resultado
    if (percentage >= 0.5) {
      this.showConfetti();
      this.showSuccessAnimation = true;
      setTimeout(() => {
        this.showSuccessAnimation = false;
      }, 3000);
    } else {
      this.showSadMessage();
    }

    // ✅ GUARDAR RESULTADOS EN EL BACKEND
    this.saveTestResults(this.test.id, answersPayload, correct, total);
  }

  // ✅ Nuevo método para guardar resultados
  saveTestResults(testId: number, answers: any[], correct: number, total: number) {
    this.saving = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('X-Skip-Loading', 'true'); // Evitar loading global

    const payload = { answers };

    this.http.post(`${environment.apiUrl}/tests/${testId}/submit`, payload, { headers }).subscribe({
      next: (response: any) => {
        console.log('✅ Resultados guardados en el servidor:', response);
        // Actualizar el resultado con los datos del servidor
        this.result = {
          ...this.result,
          score_total: response.score_total,
          saved_in_backend: true,
        };
        this.saving = false;
      },
      error: (err) => {
        console.error('❌ Error al guardar resultados:', err);
        this.saving = false;
        // Mostrar mensaje pero no bloquear la experiencia del usuario
        console.warn('Los resultados no se guardaron en el servidor, pero se muestran localmente');
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

  ngOnDestroy(): void {
    if (this.failMessageTimeout) {
      clearTimeout(this.failMessageTimeout);
    }
  }
}
