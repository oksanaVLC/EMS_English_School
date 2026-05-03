import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedC1 } from './advanced-c1';

describe('AdvancedC1', () => {
  let component: AdvancedC1;
  let fixture: ComponentFixture<AdvancedC1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedC1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedC1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
