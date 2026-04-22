import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private auth = inject(Auth);
  private router = inject(Router);

  @ViewChild('counterElement') counterElement!: ElementRef;

  showPassword = false;
  showConfirmPassword = false;

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  animatedCount = 0;
  targetCount = 120;
  hasAnimated = false;

  // 🔥 VALIDADOR PASSWORD MATCH
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;

    return password === confirm ? null : { mismatch: true };
  }

  form = this.fb.group(
    {
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    },
    { validators: this.passwordMatchValidator },
  );

  register() {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { name, surname, email, password } = this.form.value;

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

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          // 🔥 ERROR EMAIL DUPLICADO
          if (err?.error?.errors?.email) {
            this.form.get('email')?.setErrors({ taken: true });
            this.form.get('email')?.markAsTouched();
            return;
          }

          this.errorMessage.set('Error al registrar. Inténtalo de nuevo.');
        },
      });
  }

  // --- contador (lo dejo intacto) ---
  ngAfterViewInit() {
    this.observeCounter();
  }

  observeCounter() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCount();
          observer.disconnect();
        }
      });
    });

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
