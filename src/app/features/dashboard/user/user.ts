import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user.html',
  styleUrls: ['./user.scss'],
})
export class User {
  private auth = inject(Auth);

  //  usuario completo reactivo
  user = computed(() => this.auth.user());

  //  solo nombre derivado
  // nombre
  userName = computed(() => this.auth.user()?.name ?? 'usuario');

  // avatar reactivo (SIN función)
  avatarUrl = computed(() => this.auth.user()?.avatar_url || '/images/user.webp');

  // fallback si falla la imagen
  onAvatarError(event: Event) {
    (event.target as HTMLImageElement).src = '/images/user.webp';
  }
}
