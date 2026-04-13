import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  showPassword = false;

  private apiURL = environment.apiUrl + '/api';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login() {
    if (this.form.invalid) return;

    this.successMessage.set(null);
    this.errorMessage.set(null);

    const { email, password } = this.form.value;

    this.http
      .post<any>(`${this.apiURL}/login`, {
        email,
        password,
      })
      .subscribe({
        next: (res) => {
          //  guardar token y usuario
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          const role = res.user.role;

          if (role === 'admin') {
            this.router.navigate(['/dashboard/admin']);
          } else if (role === 'teacher') {
            this.router.navigate(['/dashboard/teacher']);
          } else {
            this.router.navigate(['/dashboard/user']);
          }
        },
        error: () => {
          this.errorMessage.set('Credenciales incorrectas');
        },
      });
  }

  togglePassword(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.showPassword = !this.showPassword;
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
