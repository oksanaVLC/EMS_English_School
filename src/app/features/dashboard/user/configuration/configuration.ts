import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './configuration.html',
  styleUrls: ['./configuration.scss'],
})
export class Configuration {
  private auth = inject(Auth);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // SIGNAL global (reactivo)
  user = this.auth.user;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // FORM
  form = this.fb.group({
    name: [this.user()?.name ?? '', Validators.required],
    surname: [this.user()?.surname ?? ''],
    email: [this.user()?.email ?? '', [Validators.required, Validators.email]],
  });

  // =====================
  // AVATAR PREVIEW
  // =====================
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // =====================
  // SAVE PROFILE
  // =====================
  save() {
    const formData = new FormData();

    formData.append('name', this.form.value.name ?? '');
    formData.append('surname', this.form.value.surname ?? '');
    formData.append('email', this.form.value.email ?? '');

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.http
      .post<any>('http://127.0.0.1:8000/api/user', formData, {
        withCredentials: true, // Sanctum cookie auth
      })
      .subscribe({
        next: (res) => {
          // 🔥 actualizar estado global (navbar cambia instantáneo)
          this.auth.setUser(res.user);

          // 🔥 opcional: refrescar formulario con datos nuevos
          this.form.patchValue({
            name: res.user.name,
            surname: res.user.surname,
            email: res.user.email,
          });

          this.previewUrl = null;

          // 🔥 redirección
          this.router.navigate(['/dashboard/user']);
        },
        error: (err) => {
          console.error('Error actualizando perfil', err);
        },
      });
  }

  // =====================
  // BACK
  // =====================
  back() {
    this.router.navigate(['/dashboard/user']);
  }
}
