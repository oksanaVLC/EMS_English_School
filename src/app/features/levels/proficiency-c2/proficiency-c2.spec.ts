import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProficiencyC2 } from './proficiency-c2';

describe('ProficiencyC2', () => {
  let component: ProficiencyC2;
  let fixture: ComponentFixture<ProficiencyC2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProficiencyC2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProficiencyC2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
