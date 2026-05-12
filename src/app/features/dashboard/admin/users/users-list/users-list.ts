import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Pagination } from '../../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss'],
})
export class UsersList implements OnInit {
  users: any[] = [];
  loading = true;
  error = '';

  page = 1; //  añadido (mínimo necesario)
  currentPage = 1;
  lastPage = 1;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers(1);
  }

  loadUsers(page: number) {
    this.loading = true;

    this.http.get<any>(`${environment.apiUrl}/admin/users?page=${page}`).subscribe({
      next: (res) => {
        this.users = res.data;
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando usuarios';
        this.loading = false;
      },
    });
  }
}
