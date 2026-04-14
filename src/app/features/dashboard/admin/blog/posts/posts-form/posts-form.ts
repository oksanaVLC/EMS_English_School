import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-posts-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './posts-form.html',
  styleUrls: ['./posts-form.scss'],
})
export class PostsForm {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  isEdit = false;
  postId: string | null = null;

  file: File | null = null;
  preview: string | ArrayBuffer | null = null;

  form = this.fb.group({
    title: ['', Validators.required],
    cover: [''],
    content: ['', Validators.required],
  });

  constructor() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.postId;

    if (this.isEdit) {
      this.loadPost();
    }
  }

  // ✅ FIXED
  loadPost() {
    this.http.get<any>(`${this.apiUrl}/api/posts/${this.postId}`).subscribe((post) => {
      this.form.patchValue(post);

      if (post.cover) {
        this.preview = post.cover;
      }
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
    if (this.form.invalid) return;

    const formData = new FormData();
    const title = this.form.value.title ?? '';
    const content = this.form.value.content ?? '';

    formData.append('title', title);
    formData.append('content', content);
    formData.append('status', status);

    if (this.file) {
      formData.append('cover', this.file);
    }

    // ✅ FIXED
    if (this.isEdit) {
      formData.append('_method', 'PUT');

      this.http
        .post(`${this.apiUrl}/api/posts/${this.postId}`, formData)
        .subscribe(() => this.router.navigate(['/admin/blog/posts']));
    } else {
      this.http
        .post(`${this.apiUrl}/api/posts`, formData)
        .subscribe(() => this.router.navigate(['/admin/blog/posts']));
    }
  }
}
