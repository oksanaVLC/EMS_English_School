import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperIntermediateB2 } from './upper-intermediate-b2';

describe('UpperIntermediateB2', () => {
  let component: UpperIntermediateB2;
  let fixture: ComponentFixture<UpperIntermediateB2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpperIntermediateB2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpperIntermediateB2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
