import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss'],
})
export class UsersList implements OnInit {
  users: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>(`${environment.apiUrl}/api/users`).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Error cargando usuarios';
        this.loading = false;
      },
    });
  }
}
