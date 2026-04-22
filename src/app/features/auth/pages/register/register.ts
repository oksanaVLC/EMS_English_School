import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth); //
  private router = inject(Router);

  @ViewChild('counterElement') counterElement!: ElementRef;

  showPassword = false;
  showConfirmPassword = false;

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  animatedCount = 0;
  targetCount = 120;
  hasAnimated = false;

  serverError = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
  });

  ngAfterViewInit() {
    this.observeCounter();
  }

  register() {
    // ✅ Marcar todos los campos como touched para mostrar errores
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });

    if (this.form.invalid) {
      // ✅ Mostrar mensaje específico para términos
      if (this.form.get('acceptTerms')?.errors?.['required']) {
        this.errorMessage.set('Debes aceptar los términos y condiciones');
      } else {
        this.errorMessage.set('Por favor, completa todos los campos correctamente');
      }
      return;
    }

    this.successMessage.set(null);
    this.errorMessage.set(null);

    const { password, confirmPassword, name, surname, email } = this.form.value;

    if (password !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.auth
      .register({
        name: name || '',
        surname: surname || '',
        email: email || '',
        password: password || '',
      })
      .subscribe({
        next: () => {
          this.successMessage.set('¡Registro exitoso! Por favor inicia sesión.');
          this.form.reset();

          // ✅ Resetear touched state después de reset
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.markAsUntouched();
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          const message = err?.error?.message || 'Error al registrar. Inténtalo de nuevo.';
          this.errorMessage.set(message);
        },
      });
  }

  observeCounter() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.animateCount();
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px',
      },
    );

    if (this.counterElement) {
      observer.observe(this.counterElement.nativeElement);
    }
  }

  animateCount() {
    const duration = 1000;
    const steps = 60;
    const increment = this.targetCount / steps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;

      if (current >= this.targetCount) {
        this.animatedCount = this.targetCount;
        clearInterval(interval);
      } else {
        this.animatedCount = Math.floor(current);
      }
    }, duration / steps);
  }
}
