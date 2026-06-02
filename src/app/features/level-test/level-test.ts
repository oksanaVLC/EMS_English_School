import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

  // Backend
  private apiUrl = environment.apiUrl;
  private testId: number | null = null;

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

  startTest() {
    if (!this.questions.length) return;

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
    return this.questions[this.currentIndex];
  }

  selectOption(optionId: number) {
    if (this.locked) return;

    this.selectedOptionId = optionId;

    const q = this.currentQuestion();
    const selected = q.options.find((o) => o.id === optionId);

    //  Guardar con los nombres correctos
    this.answers.push({
      questionId: q.id, // ← para uso interno
      optionId: optionId, // ← para uso interno
      correct: selected?.correct ?? false,
    });

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

      this.animateScore();

      setTimeout(() => {
        this.showConfetti();
      }, 300);

      this.finishTestFlow();
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

    // 👇 TRANSFORMAR answers al formato que espera el backend
    const formattedAnswers = this.answers.map((answer) => ({
      question_id: answer.questionId, // ← Cambiar questionId a question_id
      option_id: answer.optionId, // ← Cambiar optionId a option_id
      correct: answer.correct,
    }));

    const payload = {
      score: this.score,
      total: this.questions.length,
      level: result.level,
      answers: formattedAnswers, // ← Usar el array transformado
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
    const token = localStorage.getItem('token');
    if (token) {
      this.saveResultToBackend();
    } else {
      // Usuario no autenticado, mostrar banner invitando a registrarse
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
}
