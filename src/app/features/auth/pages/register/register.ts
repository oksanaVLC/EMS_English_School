import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
  private auth = inject(Auth);
  private router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  register() {
    if (this.form.invalid) return;

    this.successMessage.set(null);
    this.errorMessage.set(null);

    const { password, confirmPassword, name, surname, email } = this.form.value;

    if (password !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.auth
      .register({
        name,
        surname,
        email,
        password,
      })
      .subscribe({
        next: () => {
          //  LOGIN AUTOMÁTICO
          this.auth
            .login({
              email,
              password,
            })
            .subscribe({
              next: (res) => {
                // guardar token + user
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));

                const role = res.user.role;

                this.router.navigate([`/dashboard/${role}`]);
              },
              error: () => {
                this.router.navigate(['/login']);
              },
            });
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Error al registrar. Inténtalo de nuevo.');
        },
      });
  }

  animatedCount = 0;
  targetCount = 120;

  ngOnInit() {
    this.animateCount();
  }

  animateCount() {
    const duration = 1000; // 1 segundo
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
