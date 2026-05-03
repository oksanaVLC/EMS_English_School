import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginnerA1 } from './beginner-a1';

describe('BeginnerA1', () => {
  let component: BeginnerA1;
  let fixture: ComponentFixture<BeginnerA1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeginnerA1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeginnerA1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
