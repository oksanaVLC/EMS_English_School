import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-posts-view',
  imports: [DatePipe, CommonModule],
  templateUrl: './posts-view.html',
  styleUrl: './posts-view.scss',
})
export class PostsView implements OnInit {
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
