import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './blog-detail.html',
  styleUrls: ['./blog-detail.scss'],
})
export class BlogDetail implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  private apiUrl = environment.apiUrl;

  post: any = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadPost(id);
  }

  loadPost(id: string | null) {
    if (!id) return;

    this.http.get<any>(`${this.apiUrl}/api/posts/${id}`).subscribe((res) => {
      this.post = res;
    });
  }
}
