import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrregularVerbs } from './irregular-verbs';

describe('IrregularVerbs', () => {
  let component: IrregularVerbs;
  let fixture: ComponentFixture<IrregularVerbs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IrregularVerbs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrregularVerbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
