import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { environment } from '../../../../../../environments/environment';
import { LessonModel } from '../../../../../core/models/lesson-model';
import { TestBuilder } from '../test-builder/test-builder';

@Component({
  selector: 'app-lessons-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, QuillModule, TestBuilder],
  templateUrl: './lessons-form.html',
  styleUrl: './lessons-form.scss',
})
export class LessonsForm implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}`;

  activeTab: 'content' | 'test' = 'content';

  levels: any[] = [];

  isEdit = false;
  lessonId: number | null = null;
  loading = false;

  form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],

    level_id: [null as number | null, Validators.required],

    type: ['grammar', Validators.required],
    tags: [''],
    explanation: ['', Validators.required],

    video_url: [''],
    pdf_url: [''],
    cover_url: [''],

    status: ['draft', Validators.required],
  });

  quillConfig = {
    clipboard: {
      matchVisual: false,
    },
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ color: [] }, { background: [] }],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.isEdit = !!id;
    this.lessonId = id ? Number(id) : null;

    this.loadLevels();

    if (this.isEdit) {
      this.loadLesson();
    } else {
      this.createDraftLesson();
    }
  }

  loadLevels() {
    this.http.get<any>(`${this.apiUrl}/levels`).subscribe({
      next: (res) => {
        this.levels = Array.isArray(res) ? res : res.data || res.levels || [];
      },
      error: (err) => console.error(err),
    });
  }

  loadLesson() {
    this.loading = true;

    this.http.get<LessonModel>(`${this.apiUrl}/lessons/${this.lessonId}`).subscribe({
      next: (lesson) => {
        // Limpiar &nbsp; al cargar
        const cleanExplanation = lesson.explanation?.replace(/&nbsp;/g, ' ') || '';

        this.form.patchValue({
          title: lesson.title,
          slug: lesson.slug,
          level_id: lesson.level_id,
          type: lesson.type,
          tags: lesson.tags?.join(', ') || '',
          explanation: cleanExplanation,
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

  onEditorCreated(quill: any) {
    // 1. Limpiar espacios no estándar al pegar
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (_node: any, delta: any) => {
      const ops = delta.ops.map((op: any) => {
        if (typeof op.insert === 'string') {
          op.insert = op.insert.replace(/[\u00a0\u2007\u2008\u2009]/g, ' ');
        }
        return op;
      });

      const Delta = Quill.import('delta');
      return new Delta(ops);
    });

    // 2. Forzar word-break
    const editorElement = quill.container?.querySelector('.ql-editor');
    if (editorElement) {
      editorElement.style.whiteSpace = 'normal';
      editorElement.style.wordBreak = 'break-word';
      editorElement.style.overflowWrap = 'break-word';
    }
  }

  save(status: 'draft' | 'published' = 'draft') {
    if (this.form.invalid) return;

    let value = this.form.value;

    // Limpiar &nbsp; antes de guardar
    if (value.explanation) {
      value = {
        ...value,
        explanation: value.explanation.replace(/&nbsp;/g, ' '),
      };
    }

    const payload = {
      ...value,
      level_id: Number(value.level_id),
      tags:
        value.tags
          ?.split(',')
          .map((t: string) => t.trim())
          .filter(Boolean) || [],
      status,
    };

    if (this.isEdit && this.lessonId) {
      this.http.put(`${this.apiUrl}/admin/lessons/${this.lessonId}`, payload).subscribe({
        next: () => this.router.navigate(['/admin/lessons']),
        error: (err) => console.error(err),
      });
    } else {
      this.http.post(`${this.apiUrl}/admin/lessons`, payload).subscribe({
        next: () => this.router.navigate(['/admin/lessons']),
        error: (err) => console.error(err),
      });
    }
  }

  createDraftLesson() {
    const payload = {
      title: 'Untitled',
      slug: 'untitled-' + Date.now(),
      level_id: null,
      type: 'grammar',
      tags: [],
      explanation: '',
      status: 'draft',
    };

    this.http.post(`${this.apiUrl}/admin/lessons`, payload).subscribe({
      next: (lesson: any) => {
        this.lessonId = lesson.id;
        this.isEdit = true;
      },
      error: (err) => console.error(err),
    });
  }
}
