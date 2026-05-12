import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { environment } from '../../../../../../../environments/environment';
import { CloudinaryService } from '../../../../../../core/services/cloudinary.service';

@Component({
  selector: 'app-posts-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './posts-form.html',
  styleUrls: ['./posts-form.scss'],
})
export class PostsForm implements OnInit {
  form!: FormGroup;

  loading = false;
  isEdit = false;
  postId?: number;

  preview: string | null = null;
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cloudinaryService: CloudinaryService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      short_description: [''],
      title_en: [''],
      content_en: [''],
      short_description_en: [''],
      status: ['draft', Validators.required],
      cover_url: [''], // Este campo guardará la URL de Cloudinary
    });

    // Verificar si es edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.postId = Number(id);
      this.loadPost(this.postId);
    }

    // Actualizar preview cuando cambie cover_url
    this.form.get('cover_url')?.valueChanges.subscribe((value) => {
      this.preview = value || null;
    });
  }

  /*
  |-----------------------------------------
  | LOAD POST
  |-----------------------------------------
  */
  loadPost(id: number): void {
    this.loading = true;

    // Asegúrate que la URL sea correcta
    const url = `${environment.apiUrl}/posts/${id}`;
    console.log('🔍 Cargando post desde:', url);

    this.http.get<any>(url).subscribe({
      next: (post) => {
        console.log('📦 Post cargado:', post);

        // Mapear correctamente los campos
        this.form.patchValue({
          title: post.title || '',
          content: post.content || '',
          short_description: post.short_description || '',
          title_en: post.title_en || '',
          content_en: post.content_en || '',
          short_description_en: post.short_description_en || '',
          status: post.status || 'draft',
          cover_url: post.cover_url || post.cover || '', // Compatibilidad con ambos nombres
        });

        this.preview = post.cover_url || post.cover || null;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error cargando post:', err);
        console.error('❌ URL:', url);
        this.loading = false;
      },
    });
  }

  /*
  |-----------------------------------------
  | SAVE POST
  |-----------------------------------------
  */
  save(status: 'draft' | 'published'): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('⚠️ Formulario inválido:', this.form.errors);
      return;
    }

    this.loading = true;

    // Construir payload - Asegurar que los campos coincidan con el backend
    const payload = {
      title: this.form.value.title?.trim() || '',
      content: this.form.value.content?.trim() || '',
      short_description: this.form.value.short_description || '',
      title_en: this.form.value.title_en || '',
      content_en: this.form.value.content_en || '',
      short_description_en: this.form.value.short_description_en || '',
      status: status,
      cover_url: this.form.value.cover_url || null, // Enviar null si no hay imagen
    };
    console.log('🔍 VALOR DE COVER_URL:', this.form.value.cover_url);
    console.log('🔍 PAYLOAD COMPLETO:', JSON.stringify(payload, null, 2));
    console.log('📤 Enviando payload:', payload);
    console.log('📤 Es edición:', this.isEdit);
    console.log('📤 ID:', this.postId);

    const url = `${environment.apiUrl}/posts${this.isEdit ? `/${this.postId}` : ''}`;
    const method = this.isEdit ? 'PUT' : 'POST';

    console.log(`📤 ${method} a:`, url);

    const request = this.isEdit ? this.http.put(url, payload) : this.http.post(url, payload);

    request.subscribe({
      next: (response) => {
        console.log('✅ Guardado exitoso:', response);
        this.loading = false;
        this.router.navigate(['/admin/posts']);
      },
      error: (err) => {
        console.error('❌ Error guardando:');
        console.error('❌ Status:', err.status);
        console.error('❌ Message:', err.message);
        console.error('❌ Error Body:', err.error);

        // Mostrar mensaje de error específico
        if (err.status === 422) {
          console.error('❌ Errores de validación:', err.error.errors);
          alert('Error de validación. Revisa los campos del formulario.');
        } else if (err.status === 500) {
          alert('Error en el servidor. Contacta al administrador.');
        } else {
          alert(`Error: ${err.message || 'No se pudo guardar el post'}`);
        }

        this.loading = false;
      },
    });
  }

  /*
  |-----------------------------------------
  | CLOUDINARY UPLOAD
  |-----------------------------------------
  */
  uploadFile(file: File): void {
    // Validaciones
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

    this.loading = true;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.selectedFile = file;

    console.log('📸 Subiendo imagen a Cloudinary...');
    console.log('📸 Nombre:', file.name);
    console.log('📸 Tamaño:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('📸 Tipo:', file.type);

    this.cloudinaryService.uploadImage(file).subscribe({
      next: (res) => {
        console.log('✅ Respuesta Cloudinary:', res);
        console.log('✅ URL de la imagen:', res.secure_url);

        this.form.patchValue({
          cover_url: res.secure_url,
        });

        this.preview = res.secure_url;
        this.loading = false;
        this.uploadProgress = null;
        this.selectedFile = null;
        this.uploadError = null;

        // Limpiar el input file
        this.clearFileInput();

        // Pequeño mensaje de éxito
        console.log('✨ Imagen asignada al campo cover_url');
      },
      error: (err) => {
        console.error('❌ Error en Cloudinary:');
        console.error('❌ Status:', err.status);
        console.error('❌ Error:', err.error);

        this.uploadError = 'Error al subir la imagen. Por favor, intenta de nuevo.';
        alert(this.uploadError);
        this.loading = false;
        this.uploadProgress = null;
        this.selectedFile = null;
      },
    });
  }

  /*
  |-----------------------------------------
  | CLEAR FILE INPUT
  |-----------------------------------------
  */
  private clearFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /*
  |-----------------------------------------
  | FILE INPUT
  |-----------------------------------------
  */
  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
    this.uploadFile(file);
  }

  /*
  |-----------------------------------------
  | DRAG & DROP
  |-----------------------------------------
  */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    console.log('📦 Archivo soltado:', file.name);
    this.uploadFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /*
  |-----------------------------------------
  | REMOVE IMAGE
  |-----------------------------------------
  */
  removeImage(): void {
    this.form.patchValue({
      cover_url: '',
    });
    this.preview = null;
    this.uploadError = null;
    this.clearFileInput();
    console.log('🗑️ Imagen removida');
  }

  /*
  |-----------------------------------------
  | TRIGGER FILE INPUT
  |-----------------------------------------
  */
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
