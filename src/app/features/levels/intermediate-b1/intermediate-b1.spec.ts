import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediateB1 } from './intermediate-b1';

describe('IntermediateB1', () => {
  let component: IntermediateB1;
  let fixture: ComponentFixture<IntermediateB1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntermediateB1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntermediateB1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
