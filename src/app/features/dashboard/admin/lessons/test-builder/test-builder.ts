import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-test-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './test-builder.html',
  styleUrl: './test-builder.scss',
})
export class TestBuilder implements OnDestroy {
  form: FormGroup;

  loading = false;
  saving = false;
  hasChanges = false;

  private _lessonId!: number;
  private originalValue: any = null;

  letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  @Input()
  set lessonId(value: number) {
    if (!value) return;

    this._lessonId = value;
    this.loadTest();
  }

  get lessonId(): number {
    return this._lessonId;
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private location: Location,
  ) {
    this.form = this.fb.group({
      status: ['draft', Validators.required],
      questions: this.fb.array([]),
    });

    // Detectar cambios en el formulario
    this.form.valueChanges.subscribe(() => {
      this.hasChanges = true;
    });
  }

  ngOnDestroy(): void {
    // Limpiar timeouts si existen
  }

  /*
  |--------------------------------------------------------------------------
  | QUESTIONS
  |--------------------------------------------------------------------------
  */

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  createQuestionGroup(question: any = null): FormGroup {
    return this.fb.group({
      question: [question?.question_text || '', Validators.required],
      explanation: [question?.explanation || ''],
      options: this.fb.array(
        question?.options?.length
          ? question.options.map((option: any) =>
              this.fb.control(option.option_text, Validators.required),
            )
          : [
              this.fb.control('', Validators.required),
              this.fb.control('', Validators.required),
              this.fb.control('', Validators.required),
              this.fb.control('', Validators.required),
            ],
      ),
      correct_answers: [question?.options?.findIndex((o: any) => o.is_correct) ?? 0],
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);

    if (this.questions.length === 0) {
      this.addQuestion();
    }
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  setCorrect(questionIndex: number, optionIndex: number): void {
    this.questions.at(questionIndex).patchValue({
      correct_answers: optionIndex,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | LOAD TEST
  |--------------------------------------------------------------------------
  */

  loadTest(): void {
    if (!this.lessonId) return;

    this.loading = true;

    this.http.get<any>(`${environment.apiUrl}/lessons/${this.lessonId}/test`).subscribe({
      next: (res) => {
        const questions = res?.questions || [];
        const status = res?.status || 'draft';

        this.form.setControl(
          'questions',
          this.fb.array(
            questions.length
              ? questions.map((q: any) => this.createQuestionGroup(q))
              : [this.createQuestionGroup()],
          ),
        );

        this.form.patchValue({ status });

        // Guardar el estado original para detectar cambios
        this.originalValue = JSON.parse(JSON.stringify(this.form.value));
        this.hasChanges = false;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
        this.form.setControl('questions', this.fb.array([this.createQuestionGroup()]));
        this.form.patchValue({ status: 'draft' });
        this.originalValue = JSON.parse(JSON.stringify(this.form.value));
        this.hasChanges = false;
      },
    });
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE TEST
  |--------------------------------------------------------------------------
  */

  save(status: 'draft' | 'published'): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.lessonId) {
      return;
    }

    // Validar que cada pregunta tenga al menos una opcion correcta marcada
    const questionsValue = this.form.value.questions;
    for (let i = 0; i < questionsValue.length; i++) {
      const q = questionsValue[i];
      if (q.correct_answers === undefined || q.correct_answers === null) {
        alert(`La pregunta ${i + 1} no tiene una respuesta correcta seleccionada.`);
        return;
      }
    }

    this.saving = true;

    // Asegurar que correct_answers sea número
    const formValue = {
      status: status,
      questions: this.form.value.questions.map((q: any) => ({
        question: q.question,
        explanation: q.explanation || '',
        options: q.options,
        correct_answers: parseInt(q.correct_answers, 10),
      })),
    };

    this.http
      .post(`${environment.apiUrl}/admin/lessons/${this.lessonId}/test`, formValue)
      .subscribe({
        next: () => {
          this.saving = false;
          this.hasChanges = false;
          this.originalValue = JSON.parse(JSON.stringify(this.form.value));

          const message =
            status === 'published'
              ? 'Test publicado correctamente'
              : 'Borrador guardado correctamente';
          alert(message);

          // Recargar el test para mostrar los cambios
          this.loadTest();
        },
        error: (err) => {
          console.error('Error saving test:', err);
          this.saving = false;
          alert('Error al guardar el test: ' + (err.error?.message || 'Error desconocido'));
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | GO BACK WITH CONFIRMATION
  |--------------------------------------------------------------------------
  */

  goBack(): void {
    if (this.hasChanges) {
      const confirm = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
      );
      if (!confirm) {
        return;
      }
    }
    this.location.back();
  }
}
