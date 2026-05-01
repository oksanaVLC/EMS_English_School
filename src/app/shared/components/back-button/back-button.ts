import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
})
export class BackButton {
  private location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
