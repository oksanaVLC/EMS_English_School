import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../../../core/services/scroll';

@Component({
  selector: 'app-tags',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './tags.html',
  styleUrls: ['./tags.scss'],
})
export class Tags {
  @Input() items: { label: string; link: string }[] = [];

  constructor(private scroll: ScrollService) {}

  goToSection(id: string) {
    this.scroll.scrollToElement(id, 80, 'auto');
  }
}
