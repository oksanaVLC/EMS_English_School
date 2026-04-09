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

    const { password, confirmPassword, ...rest } = this.form.value;

    //  VALIDACIÓN PASSWORDS
    if (password !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.auth
      .register({
        ...rest,
        password,
      })
      .subscribe({
        next: (res) => {
          console.log('================ REGISTER SUCCESS ================');
          console.log('FULL RESPONSE:', res);

          console.log('TOKEN:', res.token);
          console.log('USER:', res.user);
          console.log('ROLE:', res.user?.role);

          this.auth.saveAuth(res);

          this.successMessage.set('Te has registrado con éxito 🎉');

          const role = res.user?.role ?? 'user';

          console.log('REDIRECTING TO ROLE:', role);

          this.router.navigate([`/dashboard/${role}`]);

          console.log('ROLE:', role);
          console.log('NAV:', `/dashboard/${role}`);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set(err?.error?.message || 'Error al registrar. Inténtalo de nuevo.');
        },
      });
  }
}
