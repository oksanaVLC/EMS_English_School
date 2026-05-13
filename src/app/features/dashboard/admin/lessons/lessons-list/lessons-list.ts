import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { LessonModel } from '../../../../../core/models/lesson-model';

@Component({
  selector: 'app-lessons-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lessons-list.html',
  styleUrl: './lessons-list.scss',
})
export class LessonsList implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  lessons: LessonModel[] = [];

  search: string = '';
  searchTimeout: any; // Para no llamar API en cada tecla

  currentPage = 1;
  lastPage = 1;

  isLoading = false;

  selectedLevel: string | null = null;
  selectedType: string | null = null;

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons(page = 1) {
    this.isLoading = true;

    let params = new HttpParams().set('page', page);

    if (this.selectedLevel) {
      params = params.set('level', this.selectedLevel);
    }

    if (this.selectedType) {
      params = params.set('type', this.selectedType);
    }

    if (this.search) {
      params = params.set('search', this.search);
    }

    this.http
      .get<any>(`${this.apiUrl}/lessons`, {
        params,
        headers: { 'X-Skip-Loading': 'true' },
      })
      .subscribe({
        next: (res) => {
          this.lessons = res.data || [];
          this.currentPage = res.current_page || 1;
          this.lastPage = res.last_page || 1;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }

  deleteLesson(id: number) {
    if (!confirm('¿Eliminar esta lección?')) return;

    this.http.delete(`${this.apiUrl}/lessons/${id}`).subscribe({
      next: () => this.loadLessons(this.currentPage),
      error: (err) => console.error(err),
    });
  }

  setLevel(level: string | null) {
    this.selectedLevel = level;
    this.loadLessons(1);
  }

  setType(type: string | null) {
    this.selectedType = type;
    this.loadLessons(1);
  }

  onSearch() {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.loadLessons(1);
    }, 300);
  }
}
