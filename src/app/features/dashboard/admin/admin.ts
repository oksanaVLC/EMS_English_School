import { Component, computed } from '@angular/core';
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
  constructor(public auth: Auth) {}

  userName = computed(() => this.auth.user()?.name ?? 'admin');
}
