import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersHome } from './teachers-home';

describe('TeachersHome', () => {
  let component: TeachersHome;
  let fixture: ComponentFixture<TeachersHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachersHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
