import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedLessons } from './created-lessons';

describe('CreatedLessons', () => {
  let component: CreatedLessons;
  let fixture: ComponentFixture<CreatedLessons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedLessons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedLessons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
