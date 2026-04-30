import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LEVEL_TEST_QUESTIONS } from '../../core/data/questions.data'; // IMPORTAR DATOS
import { Question } from '../../core/models/question.model';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-level-test',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './level-test.html',
  styleUrl: './level-test.scss',
})
export class LevelTest implements OnInit {
  // Estado del test
  questions: Question[] = [];
  currentIndex = 0;
  selectedOptionId: number | null = null;
  locked = false;
  answers: { questionId: number; optionId: number; correct: boolean }[] = [];
  started = false;
  loading = true;
  error: string | null = null;
  showResultsScreen = false;

  constructor() {}

  ngOnInit() {
    this.loadTest();
  }

  // =========================
  // LOAD TEST (CON DATOS DEL ARCHIVO EXTERNO)
  // =========================
  loadTest() {
    this.loading = true;
    this.error = null;
    this.showResultsScreen = false;
    this.started = false;

    // Simular carga (opcional, para mostrar loading)
    setTimeout(() => {
      try {
        //  IMPORTAR LAS 50 PREGUNTAS DEL ARCHIVO EXTERNO
        this.questions = [...LEVEL_TEST_QUESTIONS];

        if (this.questions.length === 0) {
          this.error = 'No hay preguntas disponibles';
        }

        this.loading = false;
        console.log(` Test cargado con ${this.questions.length} preguntas`);
      } catch (err) {
        this.error = 'Error al cargar el test';
        this.loading = false;
        console.error(err);
      }
    }, 300); // Reducido a 300ms para mejor UX
  }

  // =========================
  //  ELIMINA getMockQuestions() - YA NO LO NECESITAS
  // =========================

  // =========================
  // COMPUTED PROPERTIES
  // =========================

  isTestFinished(): boolean {
    return this.currentIndex >= this.questions.length;
  }

  isLastQuestion(): boolean {
    return this.currentIndex === this.questions.length - 1;
  }

  currentQuestion(): Question {
    return this.questions[this.currentIndex];
  }

  // =========================
  // START TEST
  // =========================
  startTest() {
    if (!this.questions || this.questions.length === 0) {
      this.error = 'No hay preguntas para mostrar. Recarga la página.';
      return;
    }

    this.started = true;
    this.showResultsScreen = false;
    this.currentIndex = 0;
    this.selectedOptionId = null;
    this.locked = false;
    this.answers = [];
  }

  // =========================
  // SELECT OPTION
  // =========================
  selectOption(optionId: number) {
    if (this.locked) return;

    this.selectedOptionId = optionId;

    const q = this.currentQuestion();
    const selected = q.options.find((o) => o.id === optionId);
    const correct = selected?.correct ?? false;

    this.answers.push({
      questionId: q.id,
      optionId,
      correct,
    });

    this.locked = true;
  }

  // =========================
  // NEXT QUESTION
  // =========================
  next() {
    if (!this.locked) return;

    this.currentIndex++;
    this.selectedOptionId = null;
    this.locked = false;
  }

  // =========================
  // SHOW RESULTS (al finalizar)
  // =========================
  showResults() {
    this.showResultsScreen = true;
    this.started = false;
    console.log('Test completado. Puntuación:', this.score);
  }

  // =========================
  // PROGRESS BAR
  // =========================
  progress(): number {
    if (!this.questions.length) return 0;
    return (this.currentIndex / this.questions.length) * 100;
  }

  // =========================
  // UI STATES
  // =========================
  isSelected(opt: any): boolean {
    return this.selectedOptionId === opt.id;
  }

  isCorrect(opt: any): boolean {
    return this.locked && opt.correct;
  }

  isWrong(opt: any): boolean {
    return this.locked && this.selectedOptionId === opt.id && !opt.correct;
  }

  // =========================
  // SCORE
  // =========================
  get score(): number {
    return this.answers.filter((a) => a.correct).length;
  }

  // =========================
  // LEVEL RESULT CON MENSAJES DINÁMICOS
  // =========================
  levelResult(): { level: string; message: string; description: string } {
    const score = this.score;
    const total = this.questions.length;
    const percentage = (score / total) * 100;

    if (percentage <= 20) {
      return {
        level: 'A1',
        message: '✨ ¡Estás empezando! Sigue aprendiendo, cada paso cuenta. ✨',
        description:
          'Estás en los fundamentos del inglés. Con práctica constante, pronto podrás entender frases básicas y presentarte. ¡No te rindas!',
      };
    }

    if (percentage <= 40) {
      return {
        level: 'A2',
        message: '📚 ¡Buen comienzo! Tienes una base sólida, sigue practicando. 📚',
        description:
          'Ya puedes entender frases cotidianas y comunicarte en situaciones simples. Sigue así para alcanzar el nivel intermedio.',
      };
    }

    if (percentage <= 60) {
      return {
        level: 'B1',
        message: '🎯 ¡Ya alcanzas B1 (intermedio)! Sigue mejorando para llegar más alto. 🎯',
        description:
          'Tienes buen entendimiento y puedes mantener conversaciones sobre temas familiares. Necesitas seguir mejorando para alcanzar niveles superiores.',
      };
    }

    if (percentage <= 80) {
      return {
        level: 'B2',
        message: '🚀 ¡Impresionante! Nivel B2 (avanzado). Ya eres casi bilingüe. 🚀',
        description:
          'Puedes comunicarte con fluidez y naturalidad. Entiendes ideas complejas y textos técnicos. ¡Excelente trabajo!',
      };
    }

    return {
      level: 'C1',
      message: '🏆 ¡Excelente! Nivel C1 (dominio avanzado). Eres un experto en inglés. 🏆',
      description:
        'Tienes un dominio excepcional del idioma. Puedes expresarte con fluidez y precisión en cualquier situación. ¡Felicidades!',
    };
  }

  // =========================
  // RESTART TEST
  // =========================
  restartTest() {
    this.currentIndex = 0;
    this.answers = [];
    this.selectedOptionId = null;
    this.locked = false;
    this.started = false;
    this.showResultsScreen = false;
    this.loadTest();
  }

  // =========================
  // SHARE RESULT
  // =========================
  shareResult() {
    const result = this.levelResult();
    const text = `He completado el test de nivel de inglés y he obtenido nivel ${result.level}. ${result.message}`;

    if (navigator.share) {
      navigator.share({
        title: 'Mi nivel de inglés',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('¡Resultado copiado al portapapeles! Compártelo donde quieras.');
    }
  }
}
