import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TestQuestion {
  id: number;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  question_text: string;
  explanation: string;
  options: {
    id: number;
    text: string;
    correct?: boolean;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLevelTest(): Observable<TestQuestion[]> {
    // Cuando tengas backend, descomenta esta línea y comenta el mock
    // return this.http.get<TestQuestion[]>(`${this.apiUrl}/level-test`);

    // Por ahora usamos mock (el componente tiene sus propios datos)
    return of([]);
  }

  submitAnswer(payload: { questionId: number; optionId: number }) {
    // return this.http.post<{ correct: boolean; explanation?: string }>(
    //   `${this.apiUrl}/level-test/answer`,
    //   payload,
    // );
    return of({ correct: true });
  }

  finishTest(payload: { answers: any[] }) {
    // return this.http.post<any>(`${this.apiUrl}/level-test/finish`, payload);
    return of({ success: true });
  }
}
