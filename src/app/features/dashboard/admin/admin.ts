import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class Admin {
  private auth = inject(Auth);

  userName = computed(() => this.auth.user()?.name ?? 'admin');
}
