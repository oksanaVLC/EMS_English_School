import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

  form = this.fb.group({
    title: ['', Validators.required],
    short_description: [''],
    content: ['', Validators.required],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;
    this.postId = id ? parseInt(id, 10) : null;

    if (this.isEdit && this.postId) {
      this.loadPost();
    }
  }

  loadPost() {
    this.loading = true;

    this.postService.getPost(this.postId!).subscribe({
      next: (post) => {
        this.form.setValue({
          title: post.title || '',
          short_description: post.short_description || '',
          content: post.content || '',
        });

        if (post.cover) {
          this.preview = post.cover;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar post:', err);
        this.loading = false;
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  save(status: 'draft' | 'published' = 'draft') {
    if (this.form.invalid) {
      return;
    }

    const title = this.form.value.title ?? '';
    const content = this.form.value.content ?? '';
    const shortDescription = this.form.value.short_description ?? '';

    if (this.isEdit && this.postId) {
      if (this.file) {
        const titleValue = this.form.get('title')?.value;
        const contentValue = this.form.get('content')?.value;
        const shortDescriptionValue = this.form.get('short_description')?.value;

        const formData = new FormData();
        formData.append('title', titleValue || '');
        formData.append('content', contentValue || '');
        formData.append('status', status);
        formData.append('short_description', shortDescriptionValue || '');
        formData.append('cover', this.file);
        formData.append('_method', 'PUT');

        this.postService.updatePostWithImage(this.postId, formData).subscribe({
          next: () => {
            this.router.navigate(['/admin/posts']);
          },
          error: (err) => {
            if (err.error && err.error.errors) {
              const firstError = Object.values(err.error.errors)[0];
              alert(firstError);
            } else {
              alert('Error al actualizar el post');
            }
          },
        });
      } else {
        const jsonData = {
          title: title,
          content: content,
          status: status,
          short_description: shortDescription,
        };

        this.postService.updatePost(this.postId, jsonData).subscribe({
          next: () => {
            this.router.navigate(['/admin/posts']);
          },
          error: (err) => {
            if (err.error && err.error.errors) {
              let errorMsg = '';
              for (const [campo, mensajes] of Object.entries(err.error.errors)) {
                errorMsg += `${campo}: ${(mensajes as any[]).join(', ')}\n`;
              }
              alert(errorMsg);
            } else if (err.error && err.error.message) {
              alert(err.error.message);
            } else {
              alert('Error al actualizar el post');
            }
          },
        });
      }
    } else {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', status);
      formData.append('short_description', shortDescription);

      if (this.file) {
        formData.append('cover', this.file);
      }

      this.postService.createPost(formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/posts']);
        },
        error: (err) => {
          if (err.error && err.error.errors) {
            const firstError = Object.values(err.error.errors)[0];
            alert(firstError);
          } else {
            alert('Error al crear el post');
          }
        },
      });
    }
  }
}
