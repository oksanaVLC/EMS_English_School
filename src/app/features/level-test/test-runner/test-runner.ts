import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-runner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-runner.html',
  styleUrl: './test-runner.scss',
})
export class TestRunner implements OnInit {
  questions: any[] = [];

  // 👇 guardamos respuestas del usuario
  answers: { [questionId: number]: number } = {};

  submitted = false;
  score = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.questions = this.getMockQuestions();
  }

  // =========================
  // MOCK QUESTIONS
  // =========================
  getMockQuestions() {
    return [
      {
        id: 1,
        question_text: 'I have ___ apple.',
        explanation: 'Usamos "an" antes de sonido vocal.',
        options: [
          { id: 1, text: 'the', correct: false },
          { id: 2, text: 'an', correct: true },
          { id: 3, text: 'a', correct: false },
        ],
      },
      {
        id: 2,
        question_text: '___ you like pizza?',
        explanation: 'Do se usa en preguntas.',
        options: [
          { id: 4, text: 'Do', correct: true },
          { id: 5, text: 'Are', correct: false },
          { id: 6, text: 'Is', correct: false },
        ],
      },
      {
        id: 3,
        question_text: 'I ___ like coffee.',
        explanation: 'Negativo correcto: don’t like.',
        options: [
          { id: 7, text: 'don’t', correct: true },
          { id: 8, text: 'no', correct: false },
          { id: 9, text: 'not', correct: false },
        ],
      },
      {
        id: 4,
        question_text: 'I ___ got a book.',
        explanation: 'Correcto: I have got.',
        options: [
          { id: 10, text: 'have', correct: true },
          { id: 11, text: 'has', correct: false },
          { id: 12, text: 'am', correct: false },
        ],
      },
      {
        id: 5,
        question_text: 'I ___ to school every day.',
        explanation: 'Presente simple para hábitos.',
        options: [
          { id: 13, text: 'go', correct: true },
          { id: 14, text: 'goes', correct: false },
          { id: 15, text: 'going', correct: false },
        ],
      },
    ];
  }

  // =========================
  // SELECT OPTION
  // =========================
  selectOption(questionId: number, optionId: number) {
    this.answers[questionId] = optionId;
  }

  // =========================
  // SUBMIT TEST
  // =========================
  submitTest() {
    this.submitted = true;

    let correct = 0;

    this.questions.forEach((q) => {
      const selected = this.answers[q.id];
      const correctOption = q.options.find((o: any) => o.correct);

      if (selected === correctOption.id) {
        correct++;
      }
    });

    this.score = correct;

    // 👉 puedes guardar en localStorage o enviar a backend aquí
    localStorage.setItem(
      'test_result',
      JSON.stringify({
        score: correct,
        total: this.questions.length,
      }),
    );

    // 👉 navegar a resultados
    this.router.navigate(['/level-test/result']);
  }

  // =========================
  // CHECKS (UI)
  // =========================
  isSelected(qId: number, optId: number) {
    return this.answers[qId] === optId;
  }

  isCorrect(q: any, opt: any) {
    return this.submitted && opt.correct;
  }

  isWrong(q: any, opt: any) {
    return this.submitted && this.answers[q.id] === opt.id && !opt.correct;
  }
}
