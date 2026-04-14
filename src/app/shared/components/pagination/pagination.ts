import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
})
export class Pagination {
  @Input() currentPage = 1;
  @Input() lastPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  get pages(): (number | string)[] {
    const total = this.lastPage;
    const current = this.currentPage;

    const delta = 1; // cuántas alrededor del actual
    const range: (number | string)[] = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }

    return range;
  }

  goTo(page: number | string) {
    if (typeof page !== 'number') return;

    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  prev() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  next() {
    if (this.currentPage < this.lastPage) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
  isActive(page: number | string): boolean {
    return typeof page === 'number' && page === this.currentPage;
  }
}
