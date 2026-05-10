import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsForm } from './lessons-form';

describe('LessonsForm', () => {
  let component: LessonsForm;
  let fixture: ComponentFixture<LessonsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
