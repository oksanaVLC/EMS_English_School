import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CanComponentDeactivate } from '../../../../core/guards/can-deactivate-guard';
import { Auth } from '../../../../core/services/auth';
import { CloudinaryService } from '../../../../core/services/cloudinary.service';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './configuration.html',
  styleUrls: ['./configuration.scss'],
})
export class Configuration implements OnInit, OnDestroy, CanComponentDeactivate {
  private auth = inject(Auth);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private cloudinary = inject(CloudinaryService);

  deletePassword = '';
  showDeleteModal = false;

  user = this.auth.user;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  showLeaveModal = false;

  private resolveLeave: ((value: boolean) => void) | null = null;
  private originalFormValues: any = null;

  form = this.fb.group({
    name: ['', Validators.required],
    surname: [''],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    const currentUser = this.user();

    if (currentUser) {
      this.form.patchValue({
        name: currentUser.name ?? '',
        surname: currentUser.surname ?? '',
        email: currentUser.email ?? '',
      });

      this.originalFormValues = { ...this.form.value };
    }
  }

  ngOnDestroy() {
    this.showLeaveModal = false;
  }

  hasUnsavedChanges(): boolean {
    if (!this.originalFormValues) return false;

    const v = this.form.value;

    const changed =
      v.name !== this.originalFormValues.name ||
      v.surname !== this.originalFormValues.surname ||
      v.email !== this.originalFormValues.email;

    return changed || !!this.selectedFile;
  }

  //  GUARD CALLS THIS
  showLeaveConfirmation(): Promise<boolean> {
    this.showLeaveModal = true;

    return new Promise((resolve) => {
      this.resolveLeave = resolve;
    });
  }

  cancelLeave() {
    this.showLeaveModal = false;

    if (this.resolveLeave) {
      this.resolveLeave(false);
      this.resolveLeave = null;
    }
  }

  confirmLeave() {
    this.showLeaveModal = false;

    if (this.resolveLeave) {
      this.resolveLeave(true);
      this.resolveLeave = null;
    }
  }

  back() {
    this.router.navigate(['/user']);
  }

  save() {
    const file = this.selectedFile;

    if (!file) {
      this.updateProfile(null);
      return;
    }

    this.cloudinary.uploadImage(file).subscribe({
      next: (res) => this.updateProfile(res.secure_url),
      error: console.error,
    });
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Selecciona una imagen válida');
      return;
    }

    // validar tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no puede superar 2MB');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
  openDeleteModal() {
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    if (!this.deletePassword) return;

    this.http
      .post(`${environment.apiUrl}/user/delete`, {
        password: this.deletePassword,
      })
      .subscribe({
        next: () => {
          this.auth.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert('Contraseña incorrecta o error al eliminar la cuenta');
        },
      });
  }
  private updateProfile(avatarUrl: string | null) {
    const payload: any = {
      name: this.form.value.name,
      surname: this.form.value.surname,
      email: this.form.value.email,
    };

    if (avatarUrl) {
      payload.avatar_url = avatarUrl;
    }

    this.http.post(`${environment.apiUrl}/user/profile`, payload).subscribe({
      next: (res: any) => {
        this.auth.setUser({
          ...this.auth.user(),
          ...res.user,
        });

        this.selectedFile = null;
        this.previewUrl = null;

        this.router.navigate(['/user']);
      },
      error: (err) => console.error(err),
    });
  }

  // avatar base (BD o Cloudinary)
  avatarUrl = computed(() => this.user()?.avatar_url || '/images/user.webp');

  // fallback si imagen falla
  onAvatarError(event: Event) {
    (event.target as HTMLImageElement).src = '/images/user.webp';
  }
}
