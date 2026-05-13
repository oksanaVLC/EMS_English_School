import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { LessonModel } from '../../../../../core/models/lesson-model';

@Component({
  selector: 'app-lessons-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lessons-list.html',
  styleUrl: './lessons-list.scss',
})
export class LessonsList implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  lessons: LessonModel[] = [];

  currentPage = 1;
  lastPage = 1;

  isLoading = false;

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons(page = 1) {
    this.isLoading = true;

    let params = new HttpParams().set('page', page);

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
}
