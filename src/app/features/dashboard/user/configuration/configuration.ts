import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
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
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Verificar que es una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona una imagen válida (JPEG, PNG, JPG)');
      return;
    }

    // Verificar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no puede superar los 2MB');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.onerror = () => {
      alert('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  }

  // =====================
  // SAVE PROFILE
  // =====================
  save() {
    const formData = new FormData();

    // IMPORTANTE: Añadir _method para spoofing
    formData.append('_method', 'PUT');

    formData.append('name', this.form.value.name ?? '');
    formData.append('surname', this.form.value.surname ?? '');
    formData.append('email', this.form.value.email ?? '');

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    // Usar POST en lugar de PUT
    this.http.post<any>(`${environment.apiUrl}/user/profile`, formData).subscribe({
      next: (res) => {
        this.auth.setUser(res.user);
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.error('Error actualizando perfil', err);
        if (err.status === 422 && err.error?.errors) {
          const messages = Object.values(err.error.errors).flat();
          alert('Error: ' + messages.join('\n'));
        } else {
          alert('Error al actualizar el perfil');
        }
      },
    });
  }

  // =====================
  // BACK
  // =====================
  back() {
    this.router.navigate(['/user']);
  }
}
