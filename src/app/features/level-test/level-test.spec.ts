import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelTest } from './level-test';

describe('LevelTest', () => {
  let component: LevelTest;
  let fixture: ComponentFixture<LevelTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
