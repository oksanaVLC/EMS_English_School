import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../../core/services/loading';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
  imports: [AsyncPipe],
})
export class Spinner {
  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
