import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../../shared/components/button/button';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RouterLink, Button],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss'],
})
export class Skills {
  skills = [
    { name: 'Grammar', route: '/skills/grammar', icon: 'images/settings.webp', color: 'pink' },
    {
      name: 'Vocabulary',
      route: '/skills/vocabulary',
      icon: 'images/vocabulary.webp',
      color: 'orange',
    },
    {
      name: 'Pronunciation',
      route: '/skills/pronunciation',
      icon: 'images/pronunciation.webp',
      color: 'yellow',
    },
    {
      name: 'Listening',
      route: '/skills/listening',
      icon: 'images/listening.webp',
      color: 'green',
    },
    { name: 'Writing', route: '/skills/writing', icon: 'images/writing.webp', color: 'blue' },
    { name: 'Speaking', route: '/skills/speaking', icon: 'images/speaking.webp', color: 'purple' },
  ];

  levels = [
    { code: 'A1', name: 'Beginner', color: 'pink', route: '/levels/a1' },
    { code: 'A2', name: 'Elementary', color: 'orange', route: '/levels/a2' },
    { code: 'B1', name: 'Intermediate', color: 'yellow', route: '/levels/b1' },
    { code: 'B2', name: 'Upper-Intermediate', color: 'green', route: '/levels/b2' },
    { code: 'C1', name: 'Advanced', color: 'blue', route: '/levels/c1' },
    { code: 'C2', name: 'Proficiency', color: 'purple', route: '/levels/c2' },
  ];
}
