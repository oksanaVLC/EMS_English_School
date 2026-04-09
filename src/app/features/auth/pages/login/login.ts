import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  // signals
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  showPassword = false;

  // form
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
      .post<any>('http://127.0.0.1:8000/api/login', {
        email,
        password,
      })
      .subscribe({
        next: (res) => {
          this.successMessage.set('Login correcto');

          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          console.log('USER:', res.user);
          console.log('ROLE:', res.user?.role);

          const role = res.user?.role ?? 'user';

          console.log('REDIRECT ROLE:', role);

          if (role === 'admin') {
            this.router.navigate(['/dashboard/admin']);
          } else if (role === 'teacher') {
            this.router.navigate(['/dashboard/teacher']);
          } else {
            this.router.navigate(['/dashboard/user']);
          }
        },
        error: (err) => {
          console.error('LOGIN ERROR:', err);
          this.errorMessage.set('Credenciales incorrectas');
        },
      });
  }

  togglePassword(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.showPassword = !this.showPassword;
  }
}
