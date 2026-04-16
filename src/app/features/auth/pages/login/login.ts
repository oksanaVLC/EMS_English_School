import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
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

  @ViewChild('counterElement') counterElement!: ElementRef;

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showPassword = false;

  animatedCount = 0;
  targetCount = 120;
  hasAnimated = false; // Para que solo se ejecute una vez

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngAfterViewInit() {
    this.observeCounter();
  }

  /*login() {
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
  }*/

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.auth.login({ email, password }).subscribe({
      next: (response: any) => {
        console.log('Respuesta login:', response);
        const user = response.user; //  Extraer el usuario de la respuesta
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

  observeCounter() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si el elemento entra en viewport y aún no se ha animado
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.animateCount();
            observer.disconnect(); // Dejar de observar después de animar
          }
        });
      },
      {
        threshold: 0.3, // 30% visible para empezar
        rootMargin: '0px',
      },
    );

    observer.observe(this.counterElement.nativeElement);
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
