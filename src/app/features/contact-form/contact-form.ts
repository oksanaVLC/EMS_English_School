import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  @ViewChild('card') card!: ElementRef;
  submitted = false;
  submitting = false;
  error = false;

  onSubmit(form: any) {
    if (form.invalid) return;

    this.submitting = true;
    this.error = false;

    const formData = new FormData();

    // IMPORTANTE: debe coincidir con name="contact"
    formData.append('form-name', 'contact');

    // Honeypot (por si acaso)
    formData.append('bot-field', '');

    // Tus campos (no cambiamos nada)
    formData.append('name', this.formData.name);
    formData.append('email', this.formData.email);
    formData.append('subject', this.formData.subject);
    formData.append('message', this.formData.message);

    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then(() => {
        this.submitted = true;
        this.submitting = false;

        setTimeout(() => {
          const element = this.card.nativeElement;

          const yOffset = -120; // ajusta según altura de tu header
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: y,
            behavior: 'smooth',
          });
        });
      })
      .catch((error) => {
        console.error(error);
        this.error = true;
        this.submitting = false;
      });
  }
  resetForm() {
    this.submitted = false;

    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  }
}
