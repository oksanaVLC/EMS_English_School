import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostModel } from '../../../../../../core/models/post.model';
import { AdminPostService } from '../../../../../../core/services/admin-post.service';

@Component({
  selector: 'app-posts-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './posts-form.html',
  styleUrls: ['./posts-form.scss'],
})
export class PostsForm implements OnInit {
  private fb = inject(FormBuilder);
  private postService = inject(AdminPostService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = false;
  postId: number | null = null;
  loading = false;

  file: File | null = null;
  preview: string | ArrayBuffer | null = null;

  // FORM limpio
  form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],

    title_en: [''],
    content_en: [''],

    short_description: [''],
    short_description_en: [''],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.isEdit = !!id;
    this.postId = id ? Number(id) : null;

    if (this.isEdit && this.postId) {
      this.loadPost();
    }
  }

  loadPost() {
    this.loading = true;

    this.postService.getPost(this.postId!).subscribe({
      next: (post: PostModel) => {
        this.form.patchValue({
          title: post.title || '',
          content: post.content || '',

          title_en: post.title_en || '',
          content_en: post.content_en || '',

          short_description: post.short_description || '',
          short_description_en: post.short_description_en || '',
        });

        this.preview = post.cover_url ?? null;

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar post:', err);
        this.loading = false;
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  save(status: 'draft' | 'published' = 'draft') {
    if (this.form.invalid) return;

    const formData = new FormData();

    formData.append('title', this.form.value.title || '');
    formData.append('content', this.form.value.content || '');

    formData.append('title_en', this.form.value.title_en || '');
    formData.append('content_en', this.form.value.content_en || '');

    formData.append('short_description', this.form.value.short_description || '');
    formData.append('short_description_en', this.form.value.short_description_en || '');

    formData.append('status', status);

    if (this.file) {
      formData.append('cover', this.file);
    }

    // =========================
    // EDIT
    // =========================
    if (this.isEdit && this.postId) {
      const title = this.form.value.title || '';
      const content = this.form.value.content || '';

      //  CASO CON IMAGEN
      if (this.file) {
        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);
        formData.append('title_en', this.form.value.title_en || '');
        formData.append('content_en', this.form.value.content_en || '');
        formData.append('short_description', this.form.value.short_description || '');
        formData.append('short_description_en', this.form.value.short_description_en || '');
        formData.append('status', status);

        formData.append('cover', this.file);
        formData.append('_method', 'PUT');

        this.postService.updatePostWithImage(this.postId, formData).subscribe({
          next: () => this.router.navigate(['/admin/posts']),
          error: (err) => this.handleError(err),
        });
      } else {
        //  CASO SIN IMAGEN (JSON NORMAL)
        const data = {
          title,
          content,
          title_en: this.form.value.title_en || '',
          content_en: this.form.value.content_en || '',
          short_description: this.form.value.short_description || '',
          short_description_en: this.form.value.short_description_en || '',
          status,
        };

        this.postService.updatePost(this.postId, data).subscribe({
          next: () => this.router.navigate(['/admin/posts']),
          error: (err) => this.handleError(err),
        });
      }

      return;
    }

    // =========================
    // CREATE
    // =========================
    this.postService.createPost(formData).subscribe({
      next: () => this.router.navigate(['/admin/posts']),
      error: (err) => console.error('Error al crear:', err),
    });
  }

  private handleError(err: any) {
    console.error('Error completo:', err);

    if (err?.error?.errors) {
      const firstError = Object.values(err.error.errors)[0];
      alert(Array.isArray(firstError) ? firstError[0] : firstError);
    } else if (err?.error?.message) {
      alert(err.error.message);
    } else {
      alert('Error en el servidor');
    }
  }
}
