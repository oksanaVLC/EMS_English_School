import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Lesson {
  id: number;
  title: string;
  level: string;
  author: string;
  status: 'published' | 'draft';
  createdAt: Date;
}

@Component({
  selector: 'app-created-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './created-lessons.html',
  styleUrls: ['./created-lessons.scss'],
})
export class CreatedLessons {
  // 🔥 Simulación (luego esto vendrá de Laravel paginado)
  allLessons: Lesson[] = Array.from({ length: 42 }).map((_, i) => ({
    id: i + 1,
    title: `Lesson ${i + 1}`,
    level: ['A1', 'A2', 'B1', 'B2', 'C1'][i % 5],
    author: 'Admin',
    status: i % 2 === 0 ? 'published' : 'draft',
    createdAt: new Date(),
  }));

  // 📄 PAGINACIÓN
  currentPage = 1;
  pageSize = 8;

  get totalPages(): number {
    return Math.ceil(this.allLessons.length / this.pageSize);
  }

  get paginatedLessons(): Lesson[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allLessons.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  deleteLesson(id: number) {
    this.allLessons = this.allLessons.filter((l) => l.id !== id);
  }

  toggleStatus(lesson: Lesson) {
    lesson.status = lesson.status === 'published' ? 'draft' : 'published';
  }
}
