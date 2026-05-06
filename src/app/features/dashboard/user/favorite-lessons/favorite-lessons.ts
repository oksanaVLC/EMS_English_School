import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface FavoriteLesson {
  id: number;
  title: string;
  level: string;
  savedAt: string;
}

@Component({
  selector: 'app-favorite-lessons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-lessons.html',
  styleUrls: ['./favorite-lessons.scss'],
})
export class FavoriteLessons {
  @Input() lessons: FavoriteLesson[] = [];

  removeFromFavorites(lesson: FavoriteLesson) {
    console.log('Remove from favorites:', lesson);
    // aquí luego llamas a tu API Laravel
  }

  openLesson(lesson: FavoriteLesson) {
    console.log('Open lesson:', lesson);
    // aquí navegarás a la lección
  }
}
