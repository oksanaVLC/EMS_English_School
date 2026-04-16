import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth);

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showPassword = false;

  animatedCount = 0;
  targetCount = 120;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.auth.login({ email, password }).subscribe({
      next: (user: any) => {
        const role = user.role;

        if (role === 'admin') this.router.navigate(['/admin']);
        else if (role === 'teacher') this.router.navigate(['/teacher']);
        else this.router.navigate(['/user']);
      },
      error: () => {
        this.errorMessage.set('Credenciales incorrectas');
      },
    });
  }
  togglePassword(event: MouseEvent) {
    event.preventDefault();
    this.showPassword = !this.showPassword;
  }
}
