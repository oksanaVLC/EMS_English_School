import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbsService } from '../../../core/services/breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.html',
  styleUrls: ['./breadcrumbs.scss'],
})
export class Breadcrumbs {
  private service = inject(BreadcrumbsService);

  breadcrumbs = this.service.breadcrumbs;
}
