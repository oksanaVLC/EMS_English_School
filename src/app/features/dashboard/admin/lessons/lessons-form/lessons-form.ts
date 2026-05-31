import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { LessonModel } from '../../../../../core/models/lesson-model';
import { CloudinaryService } from '../../../../../core/services/cloudinary.service';
import { TestBuilder } from '../test-builder/test-builder';

@Component({
  selector: 'app-lessons-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, TestBuilder],
  templateUrl: './lessons-form.html',
  styleUrl: './lessons-form.scss',
})
export class LessonsForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cloudinaryService = inject(CloudinaryService);

  private apiUrl = `${environment.apiUrl}`;

  activeTab: 'content' | 'test' = 'content';

  levels: any[] = [];

  isEdit = false;
  lessonId: number | null = null;
  loading = false;
  saving = false;
  uploadingImage = false;
  hasUnsavedChanges = false;
  private valueChangesSubscription?: Subscription;

  // Subida de imagen
  preview: string | null = null;
  selectedFile: File | null = null;
  uploadError: string | null = null;

  // Modales
  showLeaveModal = false;
  showSuccessModal = false;
  successMessage = '';

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

    this.valueChangesSubscription = this.form.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = true;
    });

    // Actualizar preview cuando cambie cover_url
    this.form.get('cover_url')?.valueChanges.subscribe((value) => {
      this.preview = value || null;
    });
  }

  ngOnDestroy() {
    this.valueChangesSubscription?.unsubscribe();
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

        this.preview = lesson.cover_url || null;
        this.hasUnsavedChanges = false;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onEditorCreated(quill: any) {
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

    const editorElement = quill.container?.querySelector('.ql-editor');
    if (editorElement) {
      editorElement.style.whiteSpace = 'normal';
      editorElement.style.wordBreak = 'break-word';
      editorElement.style.overflowWrap = 'break-word';
    }
  }

  // ✅ SUBIDA DE IMAGEN A CLOUDINARY
  uploadFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Por favor, selecciona solo imágenes';
      alert(this.uploadError);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'La imagen no debe superar los 5MB';
      alert(this.uploadError);
      return;
    }

    this.uploadingImage = true;
    this.uploadError = null;
    this.selectedFile = file;

    this.cloudinaryService.uploadImage(file).subscribe({
      next: (res) => {
        this.form.patchValue({
          cover_url: res.secure_url,
        });
        this.preview = res.secure_url;
        this.uploadingImage = false;
        this.selectedFile = null;
        this.uploadError = null;
        this.clearFileInput();
      },
      error: (err) => {
        console.error('Error en Cloudinary:', err);
        this.uploadError = 'Error al subir la imagen. Por favor, intenta de nuevo.';
        alert(this.uploadError);
        this.uploadingImage = false;
        this.selectedFile = null;
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
    this.uploadFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    this.uploadFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  removeImage(): void {
    this.form.patchValue({
      cover_url: '',
    });
    this.preview = null;
    this.uploadError = null;
    this.clearFileInput();
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  private clearFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  validateForm(): { valid: boolean; message: string } {
    if (!this.form.value.title?.trim()) {
      return { valid: false, message: 'El título es obligatorio' };
    }
    if (!this.form.value.slug?.trim()) {
      return { valid: false, message: 'El slug es obligatorio' };
    }
    if (!this.form.value.level_id) {
      return { valid: false, message: 'El nivel es obligatorio' };
    }
    if (!this.form.value.explanation?.trim()) {
      return { valid: false, message: 'La explicación es obligatoria' };
    }
    return { valid: true, message: '' };
  }

  save(status: 'draft' | 'published' = 'draft') {
    const validation = this.validateForm();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    this.saving = true;

    let value = this.form.value;

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

    const request =
      this.isEdit && this.lessonId
        ? this.http.put(`${this.apiUrl}/admin/lessons/${this.lessonId}`, payload)
        : this.http.post(`${this.apiUrl}/admin/lessons`, payload);

    request.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.hasUnsavedChanges = false;
        this.lessonId = res.id || this.lessonId;
        this.isEdit = true;

        const message =
          status === 'published'
            ? 'Lección publicada correctamente'
            : 'Borrador guardado correctamente';

        this.showSuccess(message);

        setTimeout(() => {
          this.router.navigate(['/admin/lessons']);
        }, 1500);
      },
      error: (err) => {
        this.saving = false;
        let errorMessage = 'Error al guardar la lección';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.error?.errors) {
          const errors = Object.values(err.error.errors).flat();
          errorMessage = errors.join(', ');
        }
        alert(errorMessage);
      },
    });
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
        this.hasUnsavedChanges = false;
      },
      error: (err) => console.error(err),
    });
  }

  onCancel() {
    if (this.hasUnsavedChanges) {
      this.showLeaveModal = true;
    } else {
      this.router.navigate(['/admin/lessons']);
    }
  }

  confirmLeave() {
    this.showLeaveModal = false;
    this.hasUnsavedChanges = false;
    this.router.navigate(['/admin/lessons']);
  }

  cancelLeave() {
    this.showLeaveModal = false;
  }

  showSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessModal = true;
    setTimeout(() => {
      this.showSuccessModal = false;
    }, 2000);
  }

  getUrlHelpText(urlType: string): string {
    switch (urlType) {
      case 'cover':
        return '📷 Sube una imagen usando el área de arrastre o URL de Cloudinary';
      case 'video':
        return '🎥 URL de YouTube: https://www.youtube.com/watch?v=...';
      case 'pdf':
        return '📄 URL completa del PDF o enlace de Google Drive';
      default:
        return '';
    }
  }
}
