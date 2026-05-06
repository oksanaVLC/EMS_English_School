import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsDone } from './tests-done';

describe('TestsDone', () => {
  let component: TestsDone;
  let fixture: ComponentFixture<TestsDone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsDone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsDone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
