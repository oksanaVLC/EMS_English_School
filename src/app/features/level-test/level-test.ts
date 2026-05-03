import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';
import { LEVEL_TEST_QUESTIONS } from '../../core/data/questions.data';
import { Question } from '../../core/models/question.model';
import { ScrollService } from '../../core/services/scroll';
import { Button } from '../../shared/components/button/button';

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

  answers: { questionId: number; optionId: number; correct: boolean }[] = [];

  started = false;
  finished = false;
  loading = true;
  error: string | null = null;

  animatedScore = 0;

  constructor(private scrollService: ScrollService) {}

  ngOnInit() {
    this.loadTest();
  }

  loadTest() {
    this.loading = true;
    this.error = null;
    this.started = false;
    this.finished = false;

    setTimeout(() => {
      try {
        this.questions = [...LEVEL_TEST_QUESTIONS];

        if (!this.questions.length) {
          this.error = 'No hay preguntas disponibles';
        }

        this.loading = false;
      } catch {
        this.error = 'Error al cargar el test';
        this.loading = false;
      }
    }, 300);
  }

  startTest() {
    if (!this.questions.length) return;

    this.started = true;
    this.finished = false;

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

    this.answers.push({
      questionId: q.id,
      optionId,
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

      //  SCROLL ARRIBA CUANDO TERMINA
      setTimeout(() => {
        this.scrollService.scrollToElement('final-title', 80, 'auto');
      }, 0);

      this.animateScore();

      setTimeout(() => {
        this.showConfetti();
      }, 300);
    }
  }

  progress(): number {
    return (this.currentIndex / this.questions.length) * 100;
  }

  isSelected(opt: any): boolean {
    return this.selectedOptionId === opt.id;
  }

  isCorrect(opt: any): boolean {
    return this.locked && opt.correct;
  }

  isWrong(opt: any): boolean {
    return this.locked && this.selectedOptionId === opt.id && !opt.correct;
  }

  get score(): number {
    return this.answers.filter((a) => a.correct).length;
  }

  levelResult(): {
    level: string;
    message: string;
    description: string;
    icon: string;
  } {
    const score = this.score;
    const total = this.questions.length;
    const percentage = (score / total) * 100;

    if (percentage <= 20) {
      return {
        level: 'A1',
        icon: 'fa-solid fa-seedling',
        message: '¡Estás empezando! Sigue aprendiendo, cada paso cuenta.',
        description:
          'Estás en los fundamentos del inglés. Con práctica constante, pronto podrás entender frases básicas y presentarte. ¡No te rindas!',
      };
    }

    if (percentage <= 40) {
      return {
        level: 'A2',
        icon: 'fa-solid fa-book-open',
        message: 'Buen comienzo! Tienes una base sólida, sigue practicando.',
        description:
          'Ya puedes entender frases cotidianas y comunicarte en situaciones simples. Sigue así para alcanzar el nivel intermedio.',
      };
    }

    if (percentage <= 60) {
      return {
        level: 'B1',
        icon: 'fa-solid fa-bullseye',
        message: 'Ya alcanzas B1 (intermedio)! Sigue mejorando para llegar más alto.',
        description:
          'Tienes buen entendimiento y puedes mantener conversaciones sobre temas familiares. Necesitas seguir mejorando para alcanzar niveles superiores.',
      };
    }

    if (percentage <= 80) {
      return {
        level: 'B2',
        icon: 'fa-solid fa-rocket',
        message: 'Impresionante! Nivel B2 (avanzado). Ya eres casi bilingüe.',
        description:
          'Puedes comunicarte con fluidez y naturalidad. Entiendes ideas complejas y textos técnicos. ¡Excelente trabajo!',
      };
    }

    return {
      level: 'C1',
      icon: 'fa-solid fa-trophy',
      message: 'Excelente! Nivel C1 (dominio avanzado). Eres un experto en inglés.',
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

    this.loadTest();
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
}
