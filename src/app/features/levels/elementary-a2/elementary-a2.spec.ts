import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementaryA2 } from './elementary-a2';

describe('ElementaryA2', () => {
  let component: ElementaryA2;
  let fixture: ComponentFixture<ElementaryA2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementaryA2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementaryA2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
