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
  searchTimeout: any;

  currentPage = 1;
  lastPage = 1;

  isLoading = false;

  selectedLevel: string | null = null;
  selectedType: string | null = null;

  //  MAPA FRONT → BACKEND
  private levelMap: Record<string, number> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };

  //  MAPA BACK → UI (para mostrar en tabla)
  private levelReverseMap: Record<number, string> = {
    1: 'A1',
    2: 'A2',
    3: 'B1',
    4: 'B2',
    5: 'C1',
    6: 'C2',
  };

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons(page = 1) {
    this.isLoading = true;

    let params = new HttpParams();

    params = params.set('page', page);

    if (this.selectedLevel) {
      const levelId = this.levelMap[this.selectedLevel];
      params = params.set('level_id', String(levelId));
    }

    if (this.selectedType) {
      params = params.set('type', this.selectedType);
    }

    if (this.search) {
      params = params.set('search', this.search);
    }

    console.log('📡 Params enviados:', params.toString());

    this.http.get(`${this.apiUrl}/lessons`, { params }).subscribe({
      next: (res: any) => {
        this.lessons = res.data || [];
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

  //  helper para mostrar A1, B2...
  getLevelCode(level_id: number | null): string {
    if (!level_id) return '-';
    return this.levelReverseMap[level_id] ?? '-';
  }
}
