import { Component, Input } from '@angular/core';
//import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tags',
  standalone: true,
  // imports: [RouterLink, RouterLinkActive],
  templateUrl: './tags.html',
  styleUrls: ['./tags.scss'],
})
export class Tags {
  @Input() items: { label: string; link: string }[] = [];
}
