import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface TestDone {
  name: string;
  score: number;
  attempts: number;
  date: string;
}
@Component({
  selector: 'app-tests-done',
  imports: [CommonModule],
  templateUrl: './tests-done.html',
  styleUrl: './tests-done.scss',
})
export class TestsDone {
  @Input() tests: TestDone[] = [];

  repeatTest(test: TestDone) {
    console.log('Repeat test:', test);
  }
}
