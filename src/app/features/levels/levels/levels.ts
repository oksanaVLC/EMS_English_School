import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../../core/services/lesson';

interface Lesson {
  id: number;
  slug: string;
  title: string;
  type: string;
  tags: string[];
}

@Component({
  selector: 'app-levels',
  imports: [CommonModule],
  templateUrl: './levels.html',
  styleUrl: './levels.scss',
})
export class Levels implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lessonService = inject(LessonService);

  level: string = '';
  lessons: Lesson[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const level = params.get('level');

      if (!level) return;

      this.level = level;

      this.lessonService.getLessons(level).subscribe((res: any) => {
        this.lessons = res.data;
      });
    });
  }

  goToLesson(slug: string) {
    this.router.navigate(['/lesson', slug]);
  }

  trackById(index: number, item: Lesson) {
    return item.id;
  }
  // En tu componente Levels
  getLevelColorClass(level: string): string {
    switch (level?.toLowerCase()) {
      case 'a1':
        return 'pink';
      case 'a2':
        return 'orange';
      case 'b1':
        return 'yellow';
      case 'b2':
        return 'green';
      case 'c1':
        return 'blue';
      case 'c2':
        return 'purple';
      default:
        return 'pink';
    }
  }
  getLevelName(level: string): string {
    switch (level?.toLowerCase()) {
      case 'a1':
        return 'Basic ';
      case 'a2':
        return 'Elementary ';
      case 'b1':
        return 'Intermediate ';
      case 'b2':
        return 'Upper-Intermediate ';
      case 'c1':
        return 'Advanced ';
      case 'c2':
        return 'Proficiency ';
      default:
        return ' Level';
    }
  }
}
