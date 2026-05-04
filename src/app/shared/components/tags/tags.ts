import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tags',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './tags.html',
  styleUrls: ['./tags.scss'],
})
export class Tags {
  @Input() items: { label: string; link: string }[] = [];
}
