import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonTest } from './lesson-test';

describe('LessonTest', () => {
  let component: LessonTest;
  let fixture: ComponentFixture<LessonTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
