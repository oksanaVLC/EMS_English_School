import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsHome } from './students-home';

describe('StudentsHome', () => {
  let component: StudentsHome;
  let fixture: ComponentFixture<StudentsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
