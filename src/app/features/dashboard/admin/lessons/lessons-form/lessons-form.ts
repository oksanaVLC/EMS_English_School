import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { LessonModel } from '../../../../../core/models/lesson-model';

@Component({
  selector: 'app-lessons-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './lessons-form.html',
  styleUrl: './lessons-form.scss',
})
export class LessonsForm implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  isEdit = false;
  lessonId: number | null = null;
  loading = false;

  form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    level: ['A1', Validators.required],
    type: ['grammar', Validators.required],

    tags: [''],

    explanation: ['', Validators.required],

    video_url: [''],
    pdf_url: [''],
    cover_url: [''],

    status: ['draft', Validators.required],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.isEdit = !!id;
    this.lessonId = id ? Number(id) : null;

    if (this.isEdit) {
      this.loadLesson();
    }
  }

  loadLesson() {
    this.loading = true;

    this.http.get<LessonModel>(`${this.apiUrl}/lessons/${this.lessonId}`).subscribe({
      next: (lesson) => {
        this.form.patchValue({
          title: lesson.title,
          slug: lesson.slug,
          level: lesson.level,
          type: lesson.type,

          tags: lesson.tags?.join(', ') || '',

          explanation: lesson.explanation,
          video_url: lesson.video_url || '',
          pdf_url: lesson.pdf_url || '',
          cover_url: lesson.cover_url || '',

          status: lesson.status,
        });

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  save(status: 'draft' | 'published' = 'draft') {
    if (this.form.invalid) return;

    const value = this.form.value;

    const payload = {
      ...value,

      tags:
        value.tags
          ?.split(',')
          .map((t: string) => t.trim())
          .filter(Boolean) || [],

      status,
    };

    if (this.isEdit && this.lessonId) {
      this.http.put(`${this.apiUrl}/lessons/${this.lessonId}`, payload).subscribe({
        next: () => this.router.navigate(['/admin/lessons']),
        error: (err) => console.error(err),
      });
    } else {
      this.http.post(`${this.apiUrl}/lessons`, payload).subscribe({
        next: () => this.router.navigate(['/admin/lessons']),
        error: (err) => console.error(err),
      });
    }
  }
}
